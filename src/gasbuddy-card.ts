import { LitElement, html, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { GasBuddyCardConfig, HomeAssistant } from './types.js';
import { cardStyles } from './styles.js';
import {
  findDeviceEntities,
  getNetworkColor,
  getNetworkLogo,
  getPaymentIcons,
  formatPrice,
  formatDistance,
  formatTimestamp,
  generateSparklinePaths,
  type HistoryPoint,
} from './helpers.js';
import { t } from './i18n.js';

// Register the custom element editor
import './editor.js';

// Every config key the card consumes. Used both for entity resolution
// and for the shouldUpdate / availability checks below — single source
// of truth instead of 30-line literal repeated three times.
const ENTITY_KEYS = [
  'regular_gas', 'midgrade_gas', 'premium_gas', 'diesel',
  'regular_gas_cash', 'midgrade_gas_cash', 'premium_gas_cash', 'diesel_cash',
  'e85', 'e85_cash', 'e15', 'e15_cash', 'last_updated',
  'ev_level1', 'ev_level2', 'ev_dc_fast',
  'ev_j1772', 'ev_j1772_power',
  'ev_ccs', 'ev_ccs_power',
  'ev_chademo', 'ev_chademo_power',
  'ev_nacs', 'ev_nacs_power',
  'ev_status', 'ev_network', 'ev_pricing',
  'ev_access_hours', 'ev_cards_accepted', 'ev_date_last_confirmed',
] as const;

type EntityKey = (typeof ENTITY_KEYS)[number];
type ResolvedEntities = Record<EntityKey, string | undefined>;

const GAS_AVAILABILITY_KEYS: EntityKey[] = [
  'regular_gas', 'midgrade_gas', 'premium_gas', 'diesel',
  'regular_gas_cash', 'midgrade_gas_cash', 'premium_gas_cash', 'diesel_cash',
  'e15', 'e15_cash', 'e85', 'e85_cash',
];

// Entities whose history we fetch for the background-trend graph. Same
// set as GAS_AVAILABILITY_KEYS today; kept separate so trend coverage
// can change independently of which keys count toward "has gas".
const GAS_TREND_KEYS: EntityKey[] = GAS_AVAILABILITY_KEYS;

const EV_AVAILABILITY_KEYS: EntityKey[] = [
  'ev_level1', 'ev_level2', 'ev_dc_fast',
  'ev_j1772', 'ev_ccs', 'ev_chademo', 'ev_nacs', 'ev_network',
];

interface StationMetadata {
  name: string;
  address: string;
  distance: string;
  brandLogoUrl: string;
  attribution: string;
  mapsUrl: string;
}

@customElement('gasbuddy-card')
export class GasBuddyCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: GasBuddyCardConfig;
  @state() private _activeTab: 'gas' | 'ev' = 'gas';
  @state() private _historyData: Record<string, HistoryPoint[]> = {};
  private _lastHistoryFetch?: number;
  private _historyFetchInFlight = false;
  // device_id the current _historyData belongs to; used to reset on device change.
  private _historyForDevice?: string;

  // Set when a keyboard-driven tab switch needs to move focus to the
  // newly-active tab after the next render. Not a reactive @state.
  private _moveFocusToActiveTab = false;

  public static override styles = cardStyles;

  public setConfig(config: GasBuddyCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
    if (config.default_mode) {
      this._activeTab = config.default_mode;
    }
  }

  public getCardSize(): number {
    // 1 size unit ≈ 50px. Defaults to 4 (≈ the pre-rendered card height)
    // until hass + a configured device let us compute a tighter estimate.
    if (!this.hass || !this._config?.device_id) return 4;

    const discovered = findDeviceEntities(this.hass, this._config.device_id);
    const cfg = this._config;
    const resolve = (key: string): string | undefined =>
      (cfg[`${key}_entity` as keyof GasBuddyCardConfig] as string | undefined) ?? discovered[key];

    const isActive = (entityId?: string): boolean => {
      if (!entityId) return false;
      const s = this.hass!.states[entityId];
      return !!s && s.state !== 'unavailable' && s.state !== 'unknown';
    };

    const gasGradeKeys = ['regular_gas', 'midgrade_gas', 'premium_gas', 'diesel', 'e15', 'e85'];
    const activeGasGrades = gasGradeKeys.filter(
      (k) => isActive(resolve(k)) || isActive(resolve(`${k}_cash`)),
    ).length;

    const evKeys = [
      'ev_level1',
      'ev_level2',
      'ev_dc_fast',
      'ev_j1772',
      'ev_ccs',
      'ev_chademo',
      'ev_nacs',
      'ev_network',
    ];
    const hasEV = evKeys.some((k) => isActive(resolve(k)));
    const hasGas = activeGasGrades > 0;

    // header + footer
    let size = 2;
    // tab strip only when both modes coexist
    if (hasGas && hasEV) size += 1;
    // gas grid: ~2 cards per row on a sections view, so half-units per grade
    if (hasGas) size += Math.max(1, Math.ceil(activeGasGrades / 2));
    // ev section: charger summary + connectors grid + metadata list
    if (hasEV) size += 3;

    return Math.max(2, size);
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (this._moveFocusToActiveTab) {
      this._moveFocusToActiveTab = false;
      const active = this.renderRoot.querySelector<HTMLElement>('.tab.active');
      active?.focus();
    }

    if (!this._config?.show_trend) {
      return;
    }

    const shouldFetch =
      changedProperties.has('_config') ||
      (changedProperties.has('hass') &&
        (!this._lastHistoryFetch || Date.now() - this._lastHistoryFetch > 10 * 60 * 1000));

    if (shouldFetch) {
      this._fetchHistory();
    }
  }

  private async _fetchHistory(): Promise<void> {
    if (!this.hass || !this._config || !this._config.show_trend) {
      return;
    }

    const deviceId = this._config.device_id;
    if (!deviceId) return;

    // Guard against concurrent fetches: shouldUpdate fires often enough
    // that a second pass can be triggered while the first is still
    // awaiting the WebSocket response. Without this, two requests race
    // and the later one can overwrite the earlier one out of order.
    if (this._historyFetchInFlight) return;

    // Drop stale history when the configured device changes. The previous
    // sparklines belong to a different station entirely.
    if (this._historyForDevice && this._historyForDevice !== deviceId) {
      this._historyData = {};
    }

    // Reuse the canonical resolver so trend coverage always tracks the
    // ENTITY_KEYS / config-override surface that the rest of the card
    // consumes. Avoids drift between this list and the rest of the card.
    const entities = this._resolveEntities(deviceId);
    const entityIds = GAS_TREND_KEYS.map((k) => entities[k]).filter(
      (eid): eid is string => !!eid && !!this.hass!.states[eid],
    );

    if (entityIds.length === 0) return;

    const trendHours = this._config.trend_hours || 168;
    const now = new Date();
    const startTime = new Date(now.getTime() - trendHours * 60 * 60 * 1000);

    this._historyFetchInFlight = true;
    try {
      const result = (await this.hass.connection?.sendMessagePromise({
        type: 'history/history_during_period',
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        entity_ids: entityIds,
        include_start_time_state: true,
        significant_changes_only: false,
        no_attributes: true,
      })) as Record<string, HistoryPoint[]> | undefined;

      if (result) {
        // Replace rather than merge: only entityIds in the current request
        // are valid. Merging accumulates entries for sensors that have
        // since been deconfigured.
        this._historyData = result;
        this._historyForDevice = deviceId;
        this._lastHistoryFetch = Date.now();
      }
    } catch (err) {
      console.error('Error fetching GasBuddy card history:', err);
    } finally {
      this._historyFetchInFlight = false;
    }
  }

  private _onSelectGasTab = (): void => {
    this._activeTab = 'gas';
  };

  private _onSelectEvTab = (): void => {
    this._activeTab = 'ev';
  };

  private _onTabKeydown = (ev: KeyboardEvent): void => {
    // Implements the WAI-ARIA Authoring Practices "Tabs with Manual Activation"
    // keyboard pattern, scoped to a two-tab carousel.
    if (
      ev.key === 'ArrowLeft' ||
      ev.key === 'ArrowRight' ||
      ev.key === 'Home' ||
      ev.key === 'End'
    ) {
      ev.preventDefault();
      this._activeTab = this._activeTab === 'gas' ? 'ev' : 'gas';
      this._moveFocusToActiveTab = true;
    }
  };

  protected override shouldUpdate(changedProperties: PropertyValues): boolean {
    if (
      changedProperties.has('_config') ||
      changedProperties.has('_activeTab') ||
      changedProperties.has('_historyData')
    ) {
      return true;
    }

    if (changedProperties.has('hass')) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.hass || !this._config?.device_id) {
        return true;
      }

      const entities = this._resolveEntities(this._config.device_id);
      for (const key of ENTITY_KEYS) {
        const entityId = entities[key];
        if (entityId && oldHass.states[entityId] !== this.hass.states[entityId]) {
          return true;
        }
      }
      return false;
    }

    return true;
  }

  public static getConfigElement() {
    return document.createElement('gasbuddy-card-editor');
  }

  public static getStubConfig(
    hass: HomeAssistant,
    entities: string[],
  ): Record<string, string> {
    const gasbuddyEntity = entities.find((eid) => {
      const stateObj = hass.states[eid];
      return (
        eid.startsWith('sensor.') &&
        stateObj?.attributes &&
        (stateObj.attributes.attribution?.toLowerCase().includes('gasbuddy') ||
          eid.toLowerCase().includes('gasbuddy'))
      );
    });

    let deviceId = '';
    if (gasbuddyEntity && hass.entities?.[gasbuddyEntity]) {
      deviceId = hass.entities[gasbuddyEntity].device_id || '';
    }

    return {
      type: 'custom:gasbuddy-card',
      device_id: deviceId,
      default_mode: 'gas',
    };
  }

  private _resolveEntities(deviceId: string): ResolvedEntities {
    const discovered = findDeviceEntities(this.hass!, deviceId);
    const cfg = this._config!;
    const result = {} as ResolvedEntities;
    for (const key of ENTITY_KEYS) {
      const override = cfg[`${key}_entity` as keyof GasBuddyCardConfig] as string | undefined;
      result[key] = override || discovered[key];
    }
    return result;
  }

  private _isAvailable(entityId?: string): boolean {
    if (!entityId) return false;
    const s = this.hass!.states[entityId];
    return !!s && s.state !== 'unavailable' && s.state !== 'unknown';
  }

  private _collectStationMetadata(entities: ResolvedEntities): StationMetadata {
    const defaultStationName = t(this.hass, 'default_station_name');
    let name = defaultStationName;
    let address = '';
    let distance = '';
    let brandLogoUrl = '';
    let attribution = 'GasBuddy';
    let latitude: number | undefined;
    let longitude: number | undefined;

    for (const entityId of Object.values(entities)) {
      if (!entityId) continue;
      const stateObj = this.hass!.states[entityId];
      if (!stateObj) continue;
      const attrs = stateObj.attributes;
      if (!attrs) continue;

      if (attrs.attribution && attribution === 'GasBuddy') {
        attribution = String(attrs.attribution);
      }
      if (attrs.station_name && name === defaultStationName) {
        name = String(attrs.station_name);
      }
      if (!address) {
        if (attrs.station_address) address = String(attrs.station_address);
        else if (attrs.street_address) address = String(attrs.street_address);
      }
      if (!distance && attrs.distance_miles !== undefined) {
        distance = formatDistance(attrs.distance_miles, this.hass);
      }
      if (!brandLogoUrl && attrs.entity_picture) {
        brandLogoUrl = attrs.entity_picture as string;
      }
      if (typeof attrs.latitude === 'number' && latitude === undefined) {
        latitude = attrs.latitude;
      }
      if (typeof attrs.longitude === 'number' && longitude === undefined) {
        longitude = attrs.longitude;
      }
    }

    // Fallback: derive name from a friendly_name by stripping the sensor suffix.
    if (name === defaultStationName) {
      const firstActive = Object.values(entities).find((eid) => eid && this.hass!.states[eid]);
      if (firstActive) {
        const friendlyName = this.hass!.states[firstActive]?.attributes?.friendly_name || '';
        name = friendlyName
          .replace(/\s(Regular|Midgrade|Premium|Diesel|Last Updated|EV Level|EV DC|EV CCS|EV NACS|EV CHAdeMO|EV J1772).*/i, '')
          .trim();
      }
    }

    if (this._config!.title) {
      name = this._config!.title;
    }

    // Build a Google Maps URL from coords (preferred) or address.
    let mapsUrl = '';
    if (latitude !== undefined && longitude !== undefined) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (address) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }

    return { name, address, distance, brandLogoUrl, attribution, mapsUrl };
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const deviceId = this._config.device_id;
    if (!deviceId) {
      return html`
        <ha-card>
          <div class="card-message card-message--error">
            ${t(this.hass, 'missing_device')}
          </div>
        </ha-card>
      `;
    }

    const entities = this._resolveEntities(deviceId);
    const hasGas = GAS_AVAILABILITY_KEYS.some((k) => this._isAvailable(entities[k]));
    const hasEV = EV_AVAILABILITY_KEYS.some((k) => this._isAvailable(entities[k]));

    if (!hasGas && !hasEV) {
      return html`
        <ha-card>
          <div class="card-message card-message--info">
            ${t(this.hass, 'no_active_sensors')}
          </div>
        </ha-card>
      `;
    }

    // Auto-force the active tab when only one mode is available.
    let currentTab = this._activeTab;
    if (hasGas && !hasEV) currentTab = 'gas';
    if (hasEV && !hasGas) currentTab = 'ev';

    const meta = this._collectStationMetadata(entities);

    return html`
      <ha-card>
        ${this._renderHeader(meta, currentTab, entities.ev_network)}
        ${hasGas && hasEV ? this._renderTabs(currentTab) : ''}
        ${hasGas && hasEV
          ? html`
              <div
                id="gasbuddy-panel-gas"
                class="tab-content"
                role="tabpanel"
                aria-labelledby="gasbuddy-tab-gas"
                tabindex="0"
                ?hidden=${currentTab !== 'gas'}
              >
                ${this._renderGasContent(entities)}
              </div>
              <div
                id="gasbuddy-panel-ev"
                class="tab-content"
                role="tabpanel"
                aria-labelledby="gasbuddy-tab-ev"
                tabindex="0"
                ?hidden=${currentTab !== 'ev'}
              >
                ${this._renderEVContent(entities)}
              </div>
            `
          : html`
              <div class="tab-content">
                ${currentTab === 'gas' ? this._renderGasContent(entities) : this._renderEVContent(entities)}
              </div>
            `}
        ${this._renderFooter(meta.attribution, entities.last_updated)}
      </ha-card>
    `;
  }

  private _renderHeader(
    meta: StationMetadata,
    currentTab: 'gas' | 'ev',
    evNetworkEntityId?: string,
  ): TemplateResult {
    return html`
      <div class="header">
        <div class="header-text">
          <div class="title ellipsis" role="heading" aria-level="2">
            ${meta.mapsUrl
              ? html`
                  <a
                    class="title-link"
                    href="${meta.mapsUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Maps"
                  >
                    ${meta.name}
                    <ha-icon class="title-link-icon" icon="mdi:open-in-new" aria-hidden="true"></ha-icon>
                  </a>
                `
              : meta.name}
          </div>
          <div class="subtitle ellipsis">
            ${meta.address}${meta.address && meta.distance ? ` • ${meta.distance}` : meta.distance}
          </div>
        </div>
        <div
          class="brand-logo ${currentTab === 'ev' && evNetworkEntityId
            ? 'brand-network'
            : !meta.brandLogoUrl
            ? 'brand-logo--icon'
            : ''}"
          aria-hidden="true"
        >
          ${currentTab === 'ev' && evNetworkEntityId
            ? getNetworkLogo(this.hass!.states[evNetworkEntityId]?.state || '')
            : meta.brandLogoUrl
            ? html`<img src="${meta.brandLogoUrl}" alt="${t(this.hass, 'brand_logo_alt')}" />`
            : html`<ha-icon icon="mdi:gas-station"></ha-icon>`}
        </div>
      </div>
    `;
  }

  private _renderTabs(currentTab: 'gas' | 'ev'): TemplateResult {
    return html`
      <div class="tabs" role="tablist" aria-label="Service type">
        <button
          id="gasbuddy-tab-gas"
          class="tab ${currentTab === 'gas' ? 'active' : ''}"
          role="tab"
          aria-selected="${currentTab === 'gas' ? 'true' : 'false'}"
          aria-controls="gasbuddy-panel-gas"
          tabindex="${currentTab === 'gas' ? '0' : '-1'}"
          @click=${this._onSelectGasTab}
          @keydown=${this._onTabKeydown}
        >
          ${t(this.hass, 'tab_gas')}
        </button>
        <button
          id="gasbuddy-tab-ev"
          class="tab ${currentTab === 'ev' ? 'active' : ''}"
          role="tab"
          aria-selected="${currentTab === 'ev' ? 'true' : 'false'}"
          aria-controls="gasbuddy-panel-ev"
          tabindex="${currentTab === 'ev' ? '0' : '-1'}"
          @click=${this._onSelectEvTab}
          @keydown=${this._onTabKeydown}
        >
          ${t(this.hass, 'tab_ev')}
        </button>
      </div>
    `;
  }

  private _renderFooter(attribution: string, lastUpdatedEntityId?: string): TemplateResult {
    return html`
      <div class="footer">
        <div class="attribution">${attribution}</div>
        ${lastUpdatedEntityId
          ? html`
              <div class="last-updated">
                <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
                <span>${t(this.hass, 'updated_prefix')} ${formatTimestamp(this.hass!.states[lastUpdatedEntityId]?.state)}</span>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderTrendGraph(entityId?: string): TemplateResult {
    if (!this._config?.show_trend || !entityId) {
      return html``;
    }

    const history = this._historyData[entityId];
    if (!history || history.length === 0) {
      return html``;
    }

    const { stroke, fill } = generateSparklinePaths(history);
    if (!stroke) {
      return html``;
    }

    const gradId = `grad-${entityId.replace(/\./g, '-')}`;

    return html`
      <svg
        class="trend-svg"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${fill}" fill="url(#${gradId})" />
        <path d="${stroke}" fill="none" stroke="var(--accent-color)" stroke-width="1" />
      </svg>
    `;
  }

  private _renderGasContent(entities: ResolvedEntities): TemplateResult {
    const fuelGrades = [
      { key: 'regular_gas' as const, name: t(this.hass, 'grade_regular'), cashKey: 'regular_gas_cash' as const },
      { key: 'midgrade_gas' as const, name: t(this.hass, 'grade_midgrade'), cashKey: 'midgrade_gas_cash' as const },
      { key: 'premium_gas' as const, name: t(this.hass, 'grade_premium'), cashKey: 'premium_gas_cash' as const },
      { key: 'diesel' as const, name: t(this.hass, 'grade_diesel'), cashKey: 'diesel_cash' as const },
      { key: 'e15' as const, name: t(this.hass, 'grade_unl88'), cashKey: 'e15_cash' as const },
      { key: 'e85' as const, name: t(this.hass, 'grade_e85'), cashKey: 'e85_cash' as const },
    ];

    const activeGrades = fuelGrades.filter((g) => {
      const creditState = entities[g.key] ? this.hass!.states[entities[g.key]!] : undefined;
      const cashState = entities[g.cashKey] ? this.hass!.states[entities[g.cashKey]!] : undefined;
      const ok = (s?: { state: string }) => s && s.state !== 'unavailable' && s.state !== 'unknown';
      return ok(creditState) || ok(cashState);
    });

    return html`
      <div class="gas-grid">
        ${activeGrades.map((grade) => {
          const creditEntityId = entities[grade.key];
          const cashEntityId = entities[grade.cashKey];

          const creditState = creditEntityId ? this.hass!.states[creditEntityId] : undefined;
          const cashState = cashEntityId ? this.hass!.states[cashEntityId] : undefined;

          const creditUnit = creditState?.attributes?.unit_of_measurement as string | undefined;
          const cashUnit = cashState?.attributes?.unit_of_measurement as string | undefined;
          const creditPriceStr = creditState ? formatPrice(creditState.state, creditUnit) : '';
          const cashPriceStr = cashState ? formatPrice(cashState.state, cashUnit) : '';

          const displayPrice = creditPriceStr || cashPriceStr || '-';
          const hasBoth = creditPriceStr && cashPriceStr && creditPriceStr !== cashPriceStr;

          const unit =
            creditState?.attributes?.unit_of_measurement ??
            cashState?.attributes?.unit_of_measurement ??
            '';

          return html`
            <div
              class="price-card"
              role="group"
              aria-label="${grade.name} price: ${creditPriceStr && cashPriceStr
                ? `${creditPriceStr} ${t(this.hass, 'price_credit')}, ${cashPriceStr} ${t(this.hass, 'price_cash')}`
                : `${displayPrice} ${creditPriceStr ? t(this.hass, 'price_credit') : t(this.hass, 'price_cash')}`}"
            >
              ${this._renderTrendGraph(creditEntityId || cashEntityId)}
              <div class="price-card-content" aria-hidden="true">
                <div class="fuel-type">${grade.name}</div>
                ${hasBoth
                  ? html`
                      <div class="dual-prices">
                        <div class="price-col">
                          <span class="fuel-price">${creditPriceStr}</span>
                          <span class="price-label">${t(this.hass, 'price_credit')}</span>
                        </div>
                        <div class="price-col">
                          <span class="fuel-price">${cashPriceStr}</span>
                          <span class="price-label">${t(this.hass, 'price_cash')}</span>
                        </div>
                      </div>
                    `
                  : html`
                      <div class="fuel-price">${displayPrice}</div>
                      <div class="price-label">${creditPriceStr ? t(this.hass, 'price_credit') : t(this.hass, 'price_cash')}</div>
                    `}
                <div class="fuel-meta">
                  <span>${unit || 'USD'}</span>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEVContent(entities: ResolvedEntities): TemplateResult {
    const l1Id = entities.ev_level1;
    const l2Id = entities.ev_level2;
    const dcId = entities.ev_dc_fast;

    const l1Count = l1Id ? Number(this.hass!.states[l1Id]?.state) || 0 : 0;
    const l2Count = l2Id ? Number(this.hass!.states[l2Id]?.state) || 0 : 0;
    const dcCount = dcId ? Number(this.hass!.states[dcId]?.state) || 0 : 0;

    const connectors = [
      { name: 'J1772', countId: entities.ev_j1772, powerId: entities.ev_j1772_power },
      { name: 'CCS', countId: entities.ev_ccs, powerId: entities.ev_ccs_power },
      { name: 'CHAdeMO', countId: entities.ev_chademo, powerId: entities.ev_chademo_power },
      { name: 'NACS', countId: entities.ev_nacs, powerId: entities.ev_nacs_power },
    ];

    const activeConnectors = connectors.filter(
      (c) =>
        c.countId &&
        this.hass!.states[c.countId]?.state !== 'unavailable' &&
        Number(this.hass!.states[c.countId]?.state) > 0,
    );

    const networkName = entities.ev_network ? this.hass!.states[entities.ev_network]?.state : '';
    const networkStateObj = entities.ev_network ? this.hass!.states[entities.ev_network] : undefined;
    const website = networkStateObj?.attributes ? (networkStateObj.attributes.website as string) : undefined;
    const pricing = entities.ev_pricing ? this.hass!.states[entities.ev_pricing]?.state : '';
    const hours = entities.ev_access_hours ? this.hass!.states[entities.ev_access_hours]?.state : '';
    const acceptedCards = entities.ev_cards_accepted ? this.hass!.states[entities.ev_cards_accepted]?.state : '';
    const status = entities.ev_status ? this.hass!.states[entities.ev_status]?.state : '';
    const lastConfirmed = entities.ev_date_last_confirmed
      ? this.hass!.states[entities.ev_date_last_confirmed]?.state
      : '';

    return html`
      <div class="ev-section">
        <!-- Charger Badge Summary -->
        <div class="charger-summary">
          ${l1Count > 0
            ? html`
                <div class="charger-badge" role="group" aria-label="${l1Count} ${t(this.hass, 'charger_level1')} chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${l1Count}</span>
                    <span class="charger-label">${t(this.hass, 'charger_level1')}</span>
                  </div>
                </div>
              `
            : ''}
          ${l2Count > 0
            ? html`
                <div class="charger-badge" role="group" aria-label="${l2Count} ${t(this.hass, 'charger_level2')} chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${l2Count}</span>
                    <span class="charger-label">${t(this.hass, 'charger_level2')}</span>
                  </div>
                </div>
              `
            : ''}
          ${dcCount > 0
            ? html`
                <div class="charger-badge fast" role="group" aria-label="${dcCount} ${t(this.hass, 'charger_dc_fast')} chargers">
                  <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${dcCount}</span>
                    <span class="charger-label">${t(this.hass, 'charger_dc_fast')}</span>
                  </div>
                </div>
              `
            : ''}
        </div>

        <!-- Connectors Grid -->
        ${activeConnectors.length > 0
          ? html`
              <div>
                <div class="connector-section-title">${t(this.hass, 'connectors_heading')}</div>
                <div class="connectors-grid">
                  ${activeConnectors.map((c) => {
                    const count = this.hass!.states[c.countId!]?.state || '0';
                    const power = c.powerId ? this.hass!.states[c.powerId]?.state : undefined;
                    const hasPower = power && power !== 'unknown' && power !== 'unavailable';
                    return html`
                      <div
                        class="connector-card"
                        role="group"
                        aria-label="${count} ${c.name} connectors${hasPower ? `, power capacity ${power} kilowatts` : ''}"
                      >
                        <div class="connector-name" aria-hidden="true">${c.name}</div>
                        <div class="connector-details" aria-hidden="true">
                          <span class="connector-count">${count}x</span>
                          ${hasPower ? html`<span class="connector-power">${power} kW</span>` : ''}
                        </div>
                      </div>
                    `;
                  })}
                </div>
              </div>
            `
          : ''}

        <!-- Details List -->
        <div class="metadata-list">
          ${networkName && networkName !== 'unknown' && networkName !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_network')}</span>
                  <span
                    class="metadata-val network-name"
                    style="--gasbuddy-network-color: ${getNetworkColor(String(networkName))}"
                  >
                    ${website
                      ? html`<a href="${website}" target="_blank" rel="noopener noreferrer">${networkName}</a>`
                      : networkName}
                  </span>
                </div>
              `
            : ''}
          ${status && status !== 'unknown' && status !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_status')}</span>
                  <span class="metadata-val">${String(status).toUpperCase()}</span>
                </div>
              `
            : ''}
          ${pricing && pricing !== 'unknown' && pricing !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_pricing')}</span>
                  <span class="metadata-val">${pricing}</span>
                </div>
              `
            : ''}
          ${hours && hours !== 'unknown' && hours !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_access_hours')}</span>
                  <span class="metadata-val">${hours}</span>
                </div>
              `
            : ''}
          ${acceptedCards && acceptedCards !== 'unknown' && acceptedCards !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_payments')}</span>
                  <span class="metadata-val">
                    ${(() => {
                      const icons = getPaymentIcons(String(acceptedCards));
                      return icons.length > 0
                        ? html`<div class="payment-icons-container">${icons}</div>`
                        : acceptedCards;
                    })()}
                  </span>
                </div>
              `
            : ''}
          ${lastConfirmed && lastConfirmed !== 'unknown' && lastConfirmed !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">${t(this.hass, 'meta_last_confirmed')}</span>
                  <span class="metadata-val">${formatTimestamp(lastConfirmed)}</span>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

// Define the custom element in Home Assistant custom card registry
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'gasbuddy-card',
  name: 'GasBuddy Card',
  preview: true,
  description: 'A premium Home Assistant custom card for GasBuddy integration gas prices and EV stations.',
});

const CARD_VERSION = 'VERSION';
console.info(
  `%c  GASBUDDY-CARD  \n%c  Version ${CARD_VERSION}  `,
  'color: orange; font-weight: bold; background: black; padding:3px 0px;',
  'color: white; font-weight: bold; background: dimgrey; padding:3px 0px;',
);
