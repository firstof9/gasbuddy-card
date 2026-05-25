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

// Register the custom element editor
import './editor.js';

@customElement('gasbuddy-card')
export class GasBuddyCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: GasBuddyCardConfig;
  @state() private _activeTab: 'gas' | 'ev' = 'gas';
  @state() private _historyData: Record<string, HistoryPoint[]> = {};
  private _lastHistoryFetch?: number;

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
    return 4;
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

    const discovered = findDeviceEntities(this.hass, deviceId);
    const entities = {
      regular_gas: this._config.regular_gas_entity || discovered.regular_gas,
      midgrade_gas: this._config.midgrade_gas_entity || discovered.midgrade_gas,
      premium_gas: this._config.premium_gas_entity || discovered.premium_gas,
      diesel: this._config.diesel_entity || discovered.diesel,
      regular_gas_cash: this._config.regular_gas_cash_entity || discovered.regular_gas_cash,
      midgrade_gas_cash: this._config.midgrade_gas_cash_entity || discovered.midgrade_gas_cash,
      premium_gas_cash: this._config.premium_gas_cash_entity || discovered.premium_gas_cash,
      diesel_cash: this._config.diesel_cash_entity || discovered.diesel_cash,
      e85: this._config.e85_entity || discovered.e85,
      e85_cash: this._config.e85_cash_entity || discovered.e85_cash,
      e15: this._config.e15_entity || discovered.e15,
      e15_cash: this._config.e15_cash_entity || discovered.e15_cash,
    };

    const entityIds = Object.values(entities).filter(
      (eid) => eid && this.hass!.states[eid]
    ) as string[];

    if (entityIds.length === 0) return;

    const trendHours = this._config.trend_hours || 168;
    const now = new Date();
    const startTime = new Date(now.getTime() - trendHours * 60 * 60 * 1000);

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
        this._historyData = { ...this._historyData, ...result };
        this._lastHistoryFetch = Date.now();
      }
    } catch (err) {
      console.error('Error fetching GasBuddy card history:', err);
    }
  }

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
    if (changedProperties.has('_config') || changedProperties.has('_activeTab')) {
      return true;
    }

    if (changedProperties.has('hass')) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.hass || !this._config) {
        return true;
      }

      const deviceId = this._config.device_id;
      if (!deviceId) return true;

      const discovered = findDeviceEntities(this.hass, deviceId);
      const entities = [
        this._config.regular_gas_entity || discovered.regular_gas,
        this._config.midgrade_gas_entity || discovered.midgrade_gas,
        this._config.premium_gas_entity || discovered.premium_gas,
        this._config.diesel_entity || discovered.diesel,
        this._config.regular_gas_cash_entity || discovered.regular_gas_cash,
        this._config.midgrade_gas_cash_entity || discovered.midgrade_gas_cash,
        this._config.premium_gas_cash_entity || discovered.premium_gas_cash,
        this._config.diesel_cash_entity || discovered.diesel_cash,
        this._config.e85_entity || discovered.e85,
        this._config.e85_cash_entity || discovered.e85_cash,
        this._config.e15_entity || discovered.e15,
        this._config.e15_cash_entity || discovered.e15_cash,
        this._config.last_updated_entity || discovered.last_updated,
        this._config.ev_level1_entity || discovered.ev_level1,
        this._config.ev_level2_entity || discovered.ev_level2,
        this._config.ev_dc_fast_entity || discovered.ev_dc_fast,
        this._config.ev_j1772_entity || discovered.ev_j1772,
        this._config.ev_j1772_power_entity || discovered.ev_j1772_power,
        this._config.ev_ccs_entity || discovered.ev_ccs,
        this._config.ev_ccs_power_entity || discovered.ev_ccs_power,
        this._config.ev_chademo_entity || discovered.ev_chademo,
        this._config.ev_chademo_power_entity || discovered.ev_chademo_power,
        this._config.ev_nacs_entity || discovered.ev_nacs,
        this._config.ev_nacs_power_entity || discovered.ev_nacs_power,
        this._config.ev_status_entity || discovered.ev_status,
        this._config.ev_network_entity || discovered.ev_network,
        this._config.ev_pricing_entity || discovered.ev_pricing,
        this._config.ev_access_hours_entity || discovered.ev_access_hours,
        this._config.ev_cards_accepted_entity || discovered.ev_cards_accepted,
        this._config.ev_date_last_confirmed_entity || discovered.ev_date_last_confirmed,
      ].filter(Boolean) as string[];

      // Check if any of the mapped entities have changed state/attributes
      for (const entityId of entities) {
        const oldState = oldHass.states[entityId];
        const newState = this.hass.states[entityId];
        if (oldState !== newState) {
          return true;
        }
      }
      return false;
    }

    return true;
  }

  // Set up custom card editor integration
  public static getConfigElement() {
    return document.createElement('gasbuddy-card-editor');
  }

  public static getStubConfig(
    hass: HomeAssistant,
    entities: string[],
  ): Record<string, string> {
    // Find the first GasBuddy device or entity if possible
    const gasbuddyEntity = entities.find((eid) => {
      const stateObj = hass.states[eid];
      return (
        eid.startsWith('sensor.') &&
        stateObj &&
        stateObj.attributes &&
        (stateObj.attributes.attribution?.toLowerCase().includes('gasbuddy') ||
          eid.toLowerCase().includes('gasbuddy'))
      );
    });

    let deviceId = '';
    if (gasbuddyEntity && hass.entities && hass.entities[gasbuddyEntity]) {
      deviceId = hass.entities[gasbuddyEntity].device_id || '';
    }

    return {
      type: 'custom:gasbuddy-card',
      device_id: deviceId,
      default_mode: 'gas',
    };
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const deviceId = this._config.device_id;
    if (!deviceId) {
      return html`
        <ha-card>
          <div style="padding: 16px; color: red;">
            Please select a GasBuddy Device in the card configuration editor.
          </div>
        </ha-card>
      `;
    }

    // Resolve entities associated with this GasBuddy device
    const discovered = findDeviceEntities(this.hass, deviceId);

    // Merge discoveries with overrides
    const entities = {
      regular_gas: this._config.regular_gas_entity || discovered.regular_gas,
      midgrade_gas: this._config.midgrade_gas_entity || discovered.midgrade_gas,
      premium_gas: this._config.premium_gas_entity || discovered.premium_gas,
      diesel: this._config.diesel_entity || discovered.diesel,
      regular_gas_cash: this._config.regular_gas_cash_entity || discovered.regular_gas_cash,
      midgrade_gas_cash: this._config.midgrade_gas_cash_entity || discovered.midgrade_gas_cash,
      premium_gas_cash: this._config.premium_gas_cash_entity || discovered.premium_gas_cash,
      diesel_cash: this._config.diesel_cash_entity || discovered.diesel_cash,
      e85: this._config.e85_entity || discovered.e85,
      e85_cash: this._config.e85_cash_entity || discovered.e85_cash,
      e15: this._config.e15_entity || discovered.e15,
      e15_cash: this._config.e15_cash_entity || discovered.e15_cash,
      last_updated: this._config.last_updated_entity || discovered.last_updated,

      ev_level1: this._config.ev_level1_entity || discovered.ev_level1,
      ev_level2: this._config.ev_level2_entity || discovered.ev_level2,
      ev_dc_fast: this._config.ev_dc_fast_entity || discovered.ev_dc_fast,
      ev_j1772: this._config.ev_j1772_entity || discovered.ev_j1772,
      ev_j1772_power: this._config.ev_j1772_power_entity || discovered.ev_j1772_power,
      ev_ccs: this._config.ev_ccs_entity || discovered.ev_ccs,
      ev_ccs_power: this._config.ev_ccs_power_entity || discovered.ev_ccs_power,
      ev_chademo: this._config.ev_chademo_entity || discovered.ev_chademo,
      ev_chademo_power: this._config.ev_chademo_power_entity || discovered.ev_chademo_power,
      ev_nacs: this._config.ev_nacs_entity || discovered.ev_nacs,
      ev_nacs_power: this._config.ev_nacs_power_entity || discovered.ev_nacs_power,
      ev_status: this._config.ev_status_entity || discovered.ev_status,
      ev_network: this._config.ev_network_entity || discovered.ev_network,
      ev_pricing: this._config.ev_pricing_entity || discovered.ev_pricing,
      ev_access_hours: this._config.ev_access_hours_entity || discovered.ev_access_hours,
      ev_cards_accepted: this._config.ev_cards_accepted_entity || discovered.ev_cards_accepted,
      ev_date_last_confirmed: this._config.ev_date_last_confirmed_entity || discovered.ev_date_last_confirmed,
    };



    // Check availability of gas vs EV options by verifying states are active (not unavailable/unknown)
    const isAvailable = (entityId?: string) => {
      if (!entityId) return false;
      const stateObj = this.hass!.states[entityId];
      return stateObj && stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    };

    const hasGas = [
      entities.regular_gas,
      entities.midgrade_gas,
      entities.premium_gas,
      entities.diesel,
      entities.regular_gas_cash,
      entities.midgrade_gas_cash,
      entities.premium_gas_cash,
      entities.diesel_cash,
      entities.e15,
      entities.e15_cash,
      entities.e85,
      entities.e85_cash,
    ].some(isAvailable);

    const hasEV = [
      entities.ev_level1,
      entities.ev_level2,
      entities.ev_dc_fast,
      entities.ev_j1772,
      entities.ev_ccs,
      entities.ev_chademo,
      entities.ev_nacs,
      entities.ev_network,
    ].some(isAvailable);

    if (!hasGas && !hasEV) {
      return html`
        <ha-card>
          <div style="padding: 16px; color: var(--secondary-text-color);">
            No active sensors found for this GasBuddy device. Verify that the integration has loaded data successfully.
          </div>
        </ha-card>
      `;
    }

    // Auto-adjust active tab if only one service type is available
    let currentTab = this._activeTab;
    if (hasGas && !hasEV) currentTab = 'gas';
    if (hasEV && !hasGas) currentTab = 'ev';


    let stationName = 'Gas Station';
    let stationAddress = '';
    let distance = '';
    let brandLogoUrl = '';
    let attribution = 'GasBuddy';

    // Scan all resolved entities to compile the most complete station metadata
    for (const entityId of Object.values(entities)) {
      if (!entityId) continue;
      const stateObj = this.hass.states[entityId];
      if (stateObj && stateObj.attributes) {
        const attrs = stateObj.attributes;
        if (attrs.attribution && attribution === 'GasBuddy') {
          attribution = attrs.attribution;
        }
        if (attrs.station_name && stationName === 'Gas Station') {
          stationName = String(attrs.station_name);
        }
        if (attrs.station_address && !stationAddress) {
          stationAddress = String(attrs.station_address);
        } else if (attrs.street_address && !stationAddress) {
          stationAddress = String(attrs.street_address);
        }
        if (attrs.distance_miles !== undefined && !distance) {
          distance = formatDistance(attrs.distance_miles, this.hass);
        }
        if (attrs.entity_picture && !brandLogoUrl) {
          brandLogoUrl = attrs.entity_picture as string;
        }
      }
    }

    // Fallback: Parse name from friendly_name if no station_name attribute was found
    if (stationName === 'Gas Station') {
      const firstActiveEntityId = Object.values(entities).find(
        (eid) => eid && this.hass!.states[eid],
      );
      if (firstActiveEntityId) {
        const friendlyName = this.hass.states[firstActiveEntityId]?.attributes?.friendly_name || '';
        stationName = friendlyName
          .replace(/\s(Regular|Midgrade|Premium|Diesel|Last Updated|EV Level|EV DC|EV CCS|EV NACS|EV CHAdeMO|EV J1772).*/i, '')
          .trim();
      }
    }

    // Overwrite title if explicitly defined in card config
    if (this._config.title) {
      stationName = this._config.title;
    }

    return html`
      <ha-card>
        <!-- Header -->
        <div class="header">
          <div class="header-text">
            <div class="title ellipsis" role="heading" aria-level="2">${stationName}</div>
            <div class="subtitle ellipsis">
              ${stationAddress}${stationAddress && distance ? ` • ${distance}` : distance}
            </div>
          </div>
          <div
            class="brand-logo ${currentTab === 'ev' && entities.ev_network ? 'brand-network' : ''}"
            aria-hidden="true"
          >
            ${currentTab === 'ev' && entities.ev_network
              ? getNetworkLogo(this.hass.states[entities.ev_network]?.state || '')
              : brandLogoUrl
              ? html`<img src="${brandLogoUrl}" alt="Brand logo" />`
              : html`<ha-icon icon="mdi:gas-station"></ha-icon>`}
          </div>
        </div>

        <!-- Tab Switcher -->
        ${hasGas && hasEV
          ? html`
              <div class="tabs" role="tablist" aria-label="Service type">
                <button
                  id="gasbuddy-tab-gas"
                  class="tab ${currentTab === 'gas' ? 'active' : ''}"
                  role="tab"
                  aria-selected="${currentTab === 'gas' ? 'true' : 'false'}"
                  aria-controls="gasbuddy-panel-gas"
                  tabindex="${currentTab === 'gas' ? '0' : '-1'}"
                  @click=${() => (this._activeTab = 'gas')}
                  @keydown=${this._onTabKeydown}
                >
                  Gas Prices
                </button>
                <button
                  id="gasbuddy-tab-ev"
                  class="tab ${currentTab === 'ev' ? 'active' : ''}"
                  role="tab"
                  aria-selected="${currentTab === 'ev' ? 'true' : 'false'}"
                  aria-controls="gasbuddy-panel-ev"
                  tabindex="${currentTab === 'ev' ? '0' : '-1'}"
                  @click=${() => (this._activeTab = 'ev')}
                  @keydown=${this._onTabKeydown}
                >
                  EV Chargers
                </button>
              </div>
            `
          : ''}

        <!-- Tab Content -->
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

        <!-- Footer -->
        <div class="footer">
          <div class="attribution">${attribution}</div>
          <div class="last-updated">
            <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
            <span>
              Updated:
              ${entities.last_updated
                ? formatTimestamp(this.hass.states[entities.last_updated]?.state)
                : 'Recent'}
            </span>
          </div>
        </div>
      </ha-card>
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
      <svg class="trend-svg" viewBox="0 0 100 50" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.25" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${fill}" fill="url(#${gradId})" />
        <path d="${stroke}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" />
      </svg>
    `;
  }

  private _renderGasContent(entities: Record<string, string | undefined>): TemplateResult {
    const fuelGrades = [
      { key: 'regular_gas', name: 'Regular', cashKey: 'regular_gas_cash' },
      { key: 'midgrade_gas', name: 'Midgrade', cashKey: 'midgrade_gas_cash' },
      { key: 'premium_gas', name: 'Premium', cashKey: 'premium_gas_cash' },
      { key: 'diesel', name: 'Diesel', cashKey: 'diesel_cash' },
      { key: 'e15', name: 'UNL88', cashKey: 'e15_cash' },
      { key: 'e85', name: 'E85', cashKey: 'e85_cash' },
    ];

    const activeGrades = fuelGrades.filter((g) => {
      const creditState = g.key in entities && entities[g.key] ? this.hass!.states[entities[g.key]!] : undefined;
      const cashState = g.cashKey in entities && entities[g.cashKey] ? this.hass!.states[entities[g.cashKey]!] : undefined;

      const isAvailable = (stateObj?: { state: string }) =>
        stateObj && stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';

      return isAvailable(creditState) || isAvailable(cashState);
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

          let unit = '';
          if (creditState && creditState.attributes.unit_of_measurement) {
            unit = creditState.attributes.unit_of_measurement;
          } else if (cashState && cashState.attributes.unit_of_measurement) {
            unit = cashState.attributes.unit_of_measurement;
          }

          return html`
            <div class="price-card" role="group" aria-label="${grade.name} price: ${creditPriceStr && cashPriceStr ? `${creditPriceStr} Credit, ${cashPriceStr} Cash` : `${displayPrice} ${creditPriceStr ? 'Credit' : 'Cash'}`}">
              ${this._renderTrendGraph(creditEntityId || cashEntityId)}
              <div class="price-card-content" aria-hidden="true">
                <div class="fuel-type">${grade.name}</div>
                ${hasBoth
                  ? html`
                      <div class="dual-prices">
                        <div class="price-col">
                          <span class="fuel-price">${creditPriceStr}</span>
                          <span class="price-label">Credit</span>
                        </div>
                        <div class="price-col">
                          <span class="fuel-price">${cashPriceStr}</span>
                          <span class="price-label">Cash</span>
                        </div>
                      </div>
                    `
                  : html`
                      <div class="fuel-price">${displayPrice}</div>
                      <div class="price-label">${creditPriceStr ? 'Credit' : 'Cash'}</div>
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

  private _renderEVContent(entities: Record<string, string | undefined>): TemplateResult {
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
      (c) => c.countId && this.hass!.states[c.countId]?.state !== 'unavailable' && Number(this.hass!.states[c.countId]?.state) > 0,
    );

    const networkName = entities.ev_network ? this.hass!.states[entities.ev_network]?.state : '';
    const networkStateObj = entities.ev_network ? this.hass!.states[entities.ev_network] : undefined;
    const website = networkStateObj && networkStateObj.attributes ? networkStateObj.attributes.website as string : undefined;
    const pricing = entities.ev_pricing ? this.hass!.states[entities.ev_pricing]?.state : '';
    const hours = entities.ev_access_hours ? this.hass!.states[entities.ev_access_hours]?.state : '';
    const acceptedCards = entities.ev_cards_accepted ? this.hass!.states[entities.ev_cards_accepted]?.state : '';
    const status = entities.ev_status ? this.hass!.states[entities.ev_status]?.state : '';
    const lastConfirmed = entities.ev_date_last_confirmed ? this.hass!.states[entities.ev_date_last_confirmed]?.state : '';

    return html`
      <div class="ev-section">
        <!-- Charger Badge Summary -->
        <div class="charger-summary">
          ${l1Count > 0
            ? html`
                <div class="charger-badge" role="group" aria-label="${l1Count} Level 1 chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${l1Count}</span>
                    <span class="charger-label">Level 1</span>
                  </div>
                </div>
              `
            : ''}
          ${l2Count > 0
            ? html`
                <div class="charger-badge" role="group" aria-label="${l2Count} Level 2 chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${l2Count}</span>
                    <span class="charger-label">Level 2</span>
                  </div>
                </div>
              `
            : ''}
          ${dcCount > 0
            ? html`
                <div class="charger-badge fast" role="group" aria-label="${dcCount} DC Fast chargers">
                  <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${dcCount}</span>
                    <span class="charger-label">DC Fast</span>
                  </div>
                </div>
              `
            : ''}
        </div>

        <!-- Connectors Grid -->
        ${activeConnectors.length > 0
          ? html`
              <div>
                <div class="connector-section-title">Connectors</div>
                <div class="connectors-grid">
                  ${activeConnectors.map((c) => {
                    const count = this.hass!.states[c.countId!]?.state || '0';
                    const power = c.powerId ? this.hass!.states[c.powerId]?.state : undefined;
                    const hasPower = power && power !== 'unknown' && power !== 'unavailable';
                    return html`
                      <div class="connector-card" style="border-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);" role="group" aria-label="${count} ${c.name} connectors${hasPower ? `, power capacity ${power} kilowatts` : ''}">
                        <div class="connector-name" aria-hidden="true">${c.name}</div>
                        <div class="connector-details" aria-hidden="true">
                          <span class="connector-count">${count}x</span>
                          ${hasPower
                            ? html`<span class="connector-power">${power} kW</span>`
                            : ''}
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
                  <span class="metadata-key">Network</span>
                  <span
                    class="metadata-val"
                    style="color: ${getNetworkColor(String(networkName))}; font-weight: 600;"
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
                  <span class="metadata-key">Status</span>
                  <span class="metadata-val">${String(status).toUpperCase()}</span>
                </div>
              `
            : ''}
          ${pricing && pricing !== 'unknown' && pricing !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">Pricing</span>
                  <span class="metadata-val">${pricing}</span>
                </div>
              `
            : ''}
          ${hours && hours !== 'unknown' && hours !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">Access Hours</span>
                  <span class="metadata-val">${hours}</span>
                </div>
              `
            : ''}
          ${acceptedCards && acceptedCards !== 'unknown' && acceptedCards !== 'unavailable'
            ? html`
                <div class="metadata-item">
                  <span class="metadata-key">Payments</span>
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
                  <span class="metadata-key">Last Confirmed</span>
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
