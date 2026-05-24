import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { GasBuddyCardConfig, HomeAssistant } from './types.js';
import { cardStyles } from './styles.js';
import {
  findDeviceEntities,
  getNetworkColor,
  getNetworkLogo,
  formatPrice,
  formatDistance,
  formatTimestamp,
} from './helpers.js';

// Register the custom element editor
import './editor.js';

@customElement('gasbuddy-card')
export class GasBuddyCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: GasBuddyCardConfig;
  @state() private _activeTab: 'gas' | 'ev' = 'gas';

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

    // Retrieve Station Metadata from first available state object
    const sampleEntity =
      entities.regular_gas ||
      entities.ev_level2 ||
      entities.ev_dc_fast ||
      entities.last_updated;
    const sampleStateObj = sampleEntity ? this.hass.states[sampleEntity] : undefined;

    let stationName = 'Gas Station';
    let stationAddress = '';
    let distance = '';
    let brandLogoUrl = '';
    let attribution = 'GasBuddy';

    if (sampleStateObj && sampleStateObj.attributes) {
      const attrs = sampleStateObj.attributes;
      attribution = attrs.attribution || 'GasBuddy';

      // Parse station name/address from attributes
      if (currentTab === 'ev' && attrs.station_name) {
        stationName = String(attrs.station_name);
        stationAddress = String(attrs.station_address || '');
      } else {
        // Strip suffix to get station base name from friendly name
        const friendlyName = attrs.friendly_name || '';
        stationName = friendlyName
          .replace(/\s(Regular|Midgrade|Premium|Diesel|Last Updated|EV Level|EV DC|EV CCS|EV NACS|EV CHAdeMO|EV J1772).*/i, '')
          .trim();
      }

      if (attrs.distance_miles !== undefined) {
        distance = formatDistance(attrs.distance_miles);
      }

      // Check if entity picture is defined for gas station brand logo
      if (sampleStateObj.attributes.entity_picture) {
        brandLogoUrl = sampleStateObj.attributes.entity_picture as string;
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
            <div class="title ellipsis">${stationName}</div>
            <div class="subtitle ellipsis">
              ${stationAddress || 'GasBuddy Location'} ${distance ? `• ${distance}` : ''}
            </div>
          </div>
          <div class="brand-logo">
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
              <div class="tabs">
                <button
                  class="tab ${currentTab === 'gas' ? 'active' : ''}"
                  @click=${() => (this._activeTab = 'gas')}
                >
                  Gas Prices
                </button>
                <button
                  class="tab ${currentTab === 'ev' ? 'active' : ''}"
                  @click=${() => (this._activeTab = 'ev')}
                >
                  EV Chargers
                </button>
              </div>
            `
          : ''}

        <!-- Tab Content -->
        <div class="tab-content">
          ${currentTab === 'gas' ? this._renderGasContent(entities) : this._renderEVContent(entities)}
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="attribution">${attribution}</div>
          <div class="last-updated">
            <ha-icon icon="mdi:clock-outline"></ha-icon>
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

          const creditPriceStr = creditState ? formatPrice(creditState.state) : '';
          const cashPriceStr = cashState ? formatPrice(cashState.state) : '';

          const displayPrice = creditPriceStr || cashPriceStr || '-';
          const hasBoth = creditPriceStr && cashPriceStr && creditPriceStr !== cashPriceStr;

          let unit = '';
          if (creditState && creditState.attributes.unit_of_measurement) {
            unit = creditState.attributes.unit_of_measurement;
          } else if (cashState && cashState.attributes.unit_of_measurement) {
            unit = cashState.attributes.unit_of_measurement;
          }

          return html`
            <div class="price-card">
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
          ${l2Count > 0
            ? html`
                <div class="charger-badge">
                  <ha-icon icon="mdi:ev-station"></ha-icon>
                  <div class="charger-info">
                    <span class="charger-count">${l2Count}</span>
                    <span class="charger-label">Level 2</span>
                  </div>
                </div>
              `
            : ''}
          ${dcCount > 0
            ? html`
                <div class="charger-badge fast">
                  <ha-icon icon="mdi:flash"></ha-icon>
                  <div class="charger-info">
                    <span class="charger-count">${dcCount}</span>
                    <span class="charger-label">DC Fast</span>
                  </div>
                </div>
              `
            : ''}
          ${l1Count > 0 && l2Count === 0 && dcCount === 0
            ? html`
                <div class="charger-badge">
                  <ha-icon icon="mdi:ev-station"></ha-icon>
                  <div class="charger-info">
                    <span class="charger-count">${l1Count}</span>
                    <span class="charger-label">Level 1</span>
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
                    return html`
                      <div class="connector-card" style="border-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);">
                        <div class="connector-name">${c.name}</div>
                        <div class="connector-details">
                          <span class="connector-count">${count}x</span>
                          ${power && power !== 'unknown' && power !== 'unavailable'
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
                  <span class="metadata-val">${acceptedCards}</span>
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
