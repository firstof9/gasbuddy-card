import { html, type TemplateResult } from 'lit';
import type { HomeAssistant } from './types.js';

/**
 * Resolves all GasBuddy entity IDs associated with a given device ID.
 */
export function findDeviceEntities(hass: HomeAssistant, deviceId: string): Record<string, string> {
  const mapped: Record<string, string> = {};
  if (!hass || !deviceId) return mapped;

  let deviceEntities: string[] = [];

  // 1. Resolve from the Home Assistant frontend Entity Registry if available
  if (hass.entities) {
    deviceEntities = Object.values(hass.entities)
      .filter((e) => e.device_id === deviceId)
      .map((e) => e.entity_id);
  }

  // 2. Fallback: Search in hass.states for entities belonging to the gasbuddy integration
  // that share the same station_id attribute (if available)
  if (deviceEntities.length === 0) {
    const allEntities = Object.keys(hass.states);
    for (const entityId of allEntities) {
      const stateObj = hass.states[entityId];
      if (stateObj && stateObj.attributes && stateObj.attributes.station_id) {
        // If the station_id attribute matches the deviceId (sometimes deviceId is the station_id)
        if (String(stateObj.attributes.station_id) === String(deviceId)) {
          deviceEntities.push(entityId);
        }
      }
    }
  }

  // Suffix lists to map entity_ids to card config keys
  const suffixes: Record<string, string[]> = {
    regular_gas: ['_regular_gas'],
    midgrade_gas: ['_midgrade_gas'],
    premium_gas: ['_premium_gas'],
    diesel: ['_diesel'],
    regular_gas_cash: ['_regular_gas_cash'],
    midgrade_gas_cash: ['_midgrade_gas_cash'],
    premium_gas_cash: ['_premium_gas_cash'],
    diesel_cash: ['_diesel_cash'],
    e85: ['_e85'],
    e85_cash: ['_e85_cash'],
    e15: ['_unl88', '_e15_gas', '_e15'],
    e15_cash: ['_unl88_cash', '_e15_gas_cash', '_e15_cash'],
    last_updated: ['_last_updated'],

    ev_level1: ['_ev_level_1_chargers', '_ev_level1'],
    ev_level2: ['_ev_level_2_chargers', '_ev_level2'],
    ev_dc_fast: ['_ev_dc_fast_chargers', '_ev_dc_fast'],
    ev_j1772: ['_ev_j1772_connectors', '_ev_j1772'],
    ev_j1772_power: ['_ev_j1772_connector_power', '_ev_j1772_power'],
    ev_ccs: ['_ev_ccs_connectors', '_ev_ccs'],
    ev_ccs_power: ['_ev_ccs_connector_power', '_ev_ccs_power'],
    ev_chademo: ['_ev_chademo_connectors', '_ev_chademo'],
    ev_chademo_power: ['_ev_chademo_connector_power', '_ev_chademo_power'],
    ev_nacs: ['_ev_nacs_connectors', '_ev_nacs'],
    ev_nacs_power: ['_ev_nacs_connector_power', '_ev_nacs_power'],
    ev_status: ['_ev_station_status', '_ev_status'],
    ev_network: ['_ev_charging_network', '_ev_network'],
    ev_pricing: ['_ev_charging_pricing', '_ev_pricing'],
    ev_access_hours: ['_ev_access_hours'],
    ev_cards_accepted: ['_ev_payment_accepted', '_ev_cards_accepted'],
    ev_date_last_confirmed: ['_ev_last_confirmed', '_ev_date_last_confirmed'],
  };

  for (const entityId of deviceEntities) {
    const lowerEntityId = entityId.toLowerCase();
    for (const [key, list] of Object.entries(suffixes)) {
      if (list.some((s) => lowerEntityId.endsWith(s))) {
        mapped[key] = entityId;
        break;
      }
    }
  }

  return mapped;
}

/**
 * Returns a color associated with an EV charging network.
 */
export function getNetworkColor(network: string): string {
  if (!network) return 'var(--primary-color)';
  const net = network.toLowerCase();
  if (net.includes('tesla')) return '#cc0000';
  if (net.includes('chargepoint')) return '#40b83c';
  if (net.includes('evgo')) return '#0055ff';
  if (net.includes('electrify america')) return '#00a261';
  if (net.includes('blink')) return '#0066cc';
  if (net.includes('flo')) return '#1c85c8';
  if (net.includes('shell')) return '#fcd116';
  return 'var(--primary-color)';
}

/**
 * Returns an inline SVG brand logo for the EV network.
 */
export function getNetworkLogo(network: string): TemplateResult {
  if (!network) return html`<ha-icon icon="mdi:ev-station"></ha-icon>`;
  const net = network.toLowerCase();

  // Tesla SVG Red T Logo
  if (net.includes('tesla')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #cc0000;">
        <path d="M12,2C11.5,2 10,4.8 9.8,5.7C10.7,5.5 11.5,5.4 12,5.4C12.5,5.4 13.3,5.5 14.2,5.7C14,4.8 12.5,2 12,2M12,6.8C10.5,6.8 8.8,7.3 7,8.2C6.9,8.5 6.8,8.8 6.8,9C8.3,8.2 10.3,7.8 12,7.8C13.7,7.8 15.7,8.2 17.2,9C17.2,8.8 17.1,8.5 17,8.2C15.2,7.3 13.5,6.8 12,6.8M7.2,10.2C7.1,10.5 7,10.9 7,11.2C8.7,10.5 10.5,10.2 12,10.2C13.5,10.2 15.3,10.5 17,11.2C17,10.9 16.9,10.5 16.8,10.2C15.2,9.6 13.5,9.2 12,9.2C10.5,9.2 8.8,9.6 7.2,10.2M12,11.5C10.2,11.5 8.2,12 6.5,12.8C6.5,13.2 6.5,13.5 6.5,13.8C8,12.8 10.2,12.4 12,12.4C13.8,12.4 16,12.8 17.5,13.8C17.5,13.5 17.5,13.2 17.5,12.8C15.8,12 13.8,11.5 12,11.5M12,14.5C10.8,14.5 9.5,14.7 8.2,15.1L8.2,22C8.2,22 12,21.5 12,20.5L12,15.5C12,15.5 12,14.5 12,14.5Z"/>
      </svg>
    `;
  }

  // ChargePoint Style SVG (Green C shape logo)
  if (net.includes('chargepoint')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #40b83c;">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#40b83c" stroke-width="2.5"/>
        <path d="M14.5,8.5 C13.5,7.5 12,7 10.5,7 C8,7 6,9 6,11.5 C6,14 8,16 10.5,16 C12,16 13.5,15.5 14.5,14.5" fill="none" stroke="#40b83c" stroke-width="3" stroke-linecap="round"/>
        <circle cx="15" cy="11.5" r="1.5"/>
      </svg>
    `;
  }

  // EVgo style SVG (Glowing Blue/Orange)
  if (net.includes('evgo')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #0055ff;">
        <path d="M2,10 L8,10 L5,22 L14,12 L9,12 L12,2 Z" />
        <text x="14" y="21" font-size="7" font-weight="900" fill="#0055ff">go</text>
      </svg>
    `;
  }

  // Electrify America (Green EA)
  if (net.includes('electrify america')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #00a261;">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#00a261" stroke-width="2"/>
        <path d="M6,17 L10,7 L14,17 M7.5,13.5 L12.5,13.5" fill="none" stroke="#00a261" stroke-width="2"/>
        <path d="M15,7 L19,7 M15,12 L18,12 M15,17 L19,17" fill="none" stroke="#00a261" stroke-width="2"/>
      </svg>
    `;
  }

  // Blink (Lighting Bolt logo)
  if (net.includes('blink')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #0066cc;">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#0066cc" stroke-width="2"/>
        <path d="M11,4 L16,11 L13,11 L15,18 L9,11 L12,11 Z" />
      </svg>
    `;
  }

  // Flo (Waves/Lines logo)
  if (net.includes('flo')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #1c85c8;">
        <path d="M4,12 C4,7.5 7.5,4 12,4 C16.5,4 20,7.5 20,12 C20,16.5 16.5,20 12,20" fill="none" stroke="#1c85c8" stroke-width="2"/>
        <path d="M8,12 C8,9.8 9.8,8 12,8 C14.2,8 16,9.8 16,12" fill="none" stroke="#1c85c8" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Shell Recharge (Yellow Shell representation)
  if (net.includes('shell')) {
    return html`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #fcd116;">
        <path d="M12,2 A10,10 0 0,0 2,12 A10,10 0 0,0 12,22 A10,10 0 0,0 22,12 A10,10 0 0,0 12,2 M12,4 C15.5,4 18,6.5 18,10 C18,14.5 12,20 12,20 C12,20 6,14.5 6,10 C6,6.5 8.5,4 12,4 Z" />
        <circle cx="12" cy="10" r="3" fill="#d00000"/>
      </svg>
    `;
  }

  return html`<ha-icon icon="mdi:ev-station"></ha-icon>`;
}

/**
 * Formats a fuel price.
 */
export function formatPrice(price: unknown): string {
  if (price === undefined || price === null || price === 'unknown' || price === 'unavailable') {
    return '-';
  }
  const val = Number(price);
  if (isNaN(val)) return String(price);

  // Return formatted price (e.g. $3.45)
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(val);
}

/**
 * Formats a distance value.
 */
export function formatDistance(distance: unknown): string {
  if (distance === undefined || distance === null || distance === 'unknown' || distance === 'unavailable') {
    return '';
  }
  const val = Number(distance);
  if (isNaN(val)) return String(distance);
  return `${val.toFixed(1)} mi`;
}

/**
 * Formats a timestamp into a relative or friendly string.
 */
export function formatTimestamp(timestamp: unknown): string {
  if (!timestamp || timestamp === 'unknown' || timestamp === 'unavailable') {
    return 'Unknown';
  }
  try {
    const date = new Date(String(timestamp));
    if (isNaN(date.getTime())) return String(timestamp);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(timestamp);
  }
}

/**
 * Returns payment card inline SVGs for a given string of accepted payments.
 */
export function getPaymentIcons(cardsString: string): TemplateResult[] {
  if (!cardsString) return [];
  const normalized = cardsString.toLowerCase();

  // Tokenize by splitting on spaces, commas, or semicolons
  const tokens = normalized.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);

  const icons: TemplateResult[] = [];
  const added = new Set<string>();

  for (const token of tokens) {
    if ((token === 'v' || token.includes('visa')) && !added.has('visa')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Visa">
          <rect width="36" height="24" rx="3" fill="#1A1F71"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-style="italic" font-size="11">VISA</text>
        </svg>
      `);
      added.add('visa');
    } else if (
      (token === 'm' || token.includes('mastercard') || token.includes('master')) &&
      !added.has('mastercard')
    ) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Mastercard">
          <rect width="36" height="24" rx="3" fill="#111111"/>
          <circle cx="14" cy="12" r="7" fill="#EB001B"/>
          <circle cx="22" cy="12" r="7" fill="#F79E1B" fill-opacity="0.8"/>
        </svg>
      `);
      added.add('mastercard');
    } else if (
      (token === 'a' || token.includes('american') || token.includes('express') || token.includes('amex')) &&
      !added.has('amex')
    ) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="American Express">
          <rect width="36" height="24" rx="3" fill="#0070CD"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="9" letter-spacing="0.5">AMEX</text>
        </svg>
      `);
      added.add('amex');
    } else if ((token === 'd' || token.includes('discover')) && !added.has('discover')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Discover">
          <rect width="36" height="24" rx="3" fill="#F05A28"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7" letter-spacing="0.5">DISCOVER</text>
        </svg>
      `);
      added.add('discover');
    } else if (token.includes('debit') && !added.has('debit')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Debit Card">
          <rect width="36" height="24" rx="3" fill="#008080"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">DEBIT</text>
        </svg>
      `);
      added.add('debit');
    }
  }

  return icons;
}

