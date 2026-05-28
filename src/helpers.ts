import { html, type TemplateResult } from 'lit';
import type { HomeAssistant } from './types.js';
import { t } from './i18n.js';

// Suffix → config-key map. Module-scoped so it's allocated once, not per call.
const ENTITY_SUFFIXES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['regular_gas', ['_regular_gas']],
  ['midgrade_gas', ['_midgrade_gas']],
  ['premium_gas', ['_premium_gas']],
  ['diesel', ['_diesel']],
  ['regular_gas_cash', ['_regular_gas_cash']],
  ['regular_gas_deal', ['_regular_gas_deal']],
  ['midgrade_gas_cash', ['_midgrade_gas_cash']],
  ['midgrade_gas_deal', ['_midgrade_gas_deal']],
  ['premium_gas_cash', ['_premium_gas_cash']],
  ['premium_gas_deal', ['_premium_gas_deal']],
  ['diesel_cash', ['_diesel_cash']],
  ['diesel_deal', ['_diesel_deal']],
  ['e85', ['_e85']],
  ['e85_cash', ['_e85_cash']],
  ['e85_deal', ['_e85_deal']],
  ['e15', ['_unl88', '_e15_gas', '_e15']],
  ['e15_cash', ['_unl88_cash', '_e15_gas_cash', '_e15_cash']],
  ['e15_deal', ['_unl88_deal', '_e15_gas_deal', '_e15_deal']],
  ['last_updated', ['_last_updated']],
  ['ev_level1', ['_ev_level_1_chargers', '_ev_level1']],
  ['ev_level2', ['_ev_level_2_chargers', '_ev_level2']],
  ['ev_dc_fast', ['_ev_dc_fast_chargers', '_ev_dc_fast']],
  ['ev_j1772', ['_ev_j1772_connectors', '_ev_j1772']],
  ['ev_j1772_power', ['_ev_j1772_connector_power', '_ev_j1772_power']],
  ['ev_ccs', ['_ev_ccs_connectors', '_ev_ccs']],
  ['ev_ccs_power', ['_ev_ccs_connector_power', '_ev_ccs_power']],
  ['ev_chademo', ['_ev_chademo_connectors', '_ev_chademo']],
  ['ev_chademo_power', ['_ev_chademo_connector_power', '_ev_chademo_power']],
  ['ev_nacs', ['_ev_nacs_connectors', '_ev_nacs']],
  ['ev_nacs_power', ['_ev_nacs_connector_power', '_ev_nacs_power']],
  ['ev_status', ['_ev_station_status', '_ev_status']],
  ['ev_network', ['_ev_charging_network', '_ev_network']],
  ['ev_pricing', ['_ev_charging_pricing', '_ev_pricing']],
  ['ev_access_hours', ['_ev_access_hours']],
  ['ev_cards_accepted', ['_ev_payment_accepted', '_ev_cards_accepted']],
  ['ev_date_last_confirmed', ['_ev_last_confirmed', '_ev_date_last_confirmed']],
];

function mapEntitiesBySuffix(entityIds: string[]): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const entityId of entityIds) {
    const lower = entityId.toLowerCase();
    for (const [key, suffixes] of ENTITY_SUFFIXES) {
      if (suffixes.some((s) => lower.endsWith(s))) {
        mapped[key] = entityId;
        break;
      }
    }
  }
  return mapped;
}

interface NetworkBrand {
  name: string;
  color: string;
  // SVG path data (24x24 viewBox). Brands without a CC0 vector mark omit this
  // and render as a colored text pill instead.
  svgPath?: string;
}

// First substring match wins, so order matters for ambiguous names.
const NETWORK_BRANDS: ReadonlyArray<{ match: string; brand: NetworkBrand }> = [
  {
    match: 'tesla',
    brand: {
      name: 'Tesla',
      color: '#cc0000',
      // Simple Icons "Tesla" — CC0 1.0 — https://simpleicons.org/icons/tesla
      svgPath:
        'M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.034c-3.18 0-4.188.354-4.335 1.792 0 0-2.146-.795-3.229-2.43C5.28 2.431 9.525 2.34 9.525 2.34L12 5.362l-.004.002H12v-.002zm0-3.899c3.415-.03 7.326.528 11.328 2.28.535-.968.672-1.395.672-1.395C19.625.612 15.528.015 12 0 8.472.015 4.375.61 0 2.349c0 0 .195.525.672 1.396C4.674 1.989 8.585 1.435 12 1.46v.003z',
    },
  },
  {
    match: 'shell',
    brand: {
      name: 'Shell',
      color: '#fbce07',
      // Simple Icons "Shell" — CC0 1.0 — https://simpleicons.org/icons/shell
      svgPath:
        'M12 .863C5.34.863 0 6.251 0 12.98c0 .996.038 1.374.246 2.33l3.662 2.71.57 4.515h6.102l.326.227c.377.262.705.375 1.082.375.352 0 .732-.101 1.024-.313l.39-.289h6.094l.563-4.515 3.695-2.71c.208-.956.246-1.334.246-2.33C24 6.252 18.661.863 12 .863zm.996 2.258c.9 0 1.778.224 2.512.649l-2.465 12.548 3.42-12.062c1.059.36 1.863.941 2.508 1.814l.025.034-4.902 10.615 5.572-9.713.033.03c.758.708 1.247 1.567 1.492 2.648l-6.195 7.666 6.436-6.5.01.021c.253.563.417 1.36.417 1.996 0 .509-.024.712-.164 1.25l-3.554 2.602-.467 3.71h-4.475l-.517.395c-.199.158-.482.266-.682.266-.199 0-.483-.108-.682-.266l-.517-.394H6.322l-.445-3.61-3.627-2.666c-.11-.436-.16-.83-.16-1.261 0-.72.159-1.49.426-2.053l.013-.024 6.45 6.551L2.75 9.621c.25-1.063.874-2.09 1.64-2.713l5.542 9.776L4.979 6.1c.555-.814 1.45-1.455 2.546-1.827l3.424 12.069L8.355 3.816l.055-.03c.814-.45 1.598-.657 2.457-.657.195 0 .286.004.528.03l.587 13.05.46-13.059c.224-.025.309-.029.554-.029z',
    },
  },
  // Brands below have no CC0 vector mark we can ship, so they render as
  // colored text pills in their canonical brand color.
  { match: 'electrify america', brand: { name: 'Electrify America', color: '#00a261' } },
  { match: 'chargepoint', brand: { name: 'ChargePoint', color: '#40b83c' } },
  { match: 'evgo', brand: { name: 'EVgo', color: '#0055ff' } },
  { match: 'blink', brand: { name: 'Blink', color: '#0066cc' } },
  { match: 'flo', brand: { name: 'FLO', color: '#1c85c8' } },
];

export function getNetworkBrand(network?: string | null): NetworkBrand | null {
  if (!network) return null;
  const lower = String(network).toLowerCase();
  const match = NETWORK_BRANDS.find((entry) => lower.includes(entry.match));
  return match ? match.brand : null;
}

// Cache resolved entity sets keyed by the hass.entities registry object.
// HA replaces the registry object when its contents change, which invalidates
// the cache via WeakMap GC. Each registry version stores per-device results.
const registryCache = new WeakMap<object, Map<string, Record<string, string>>>();

/**
 * Resolves all GasBuddy entity IDs associated with a given device ID.
 * Results are memoized per hass.entities object so repeated calls within
 * the same registry version (e.g. shouldUpdate + render in the same tick)
 * don't re-scan the registry.
 */
export function findDeviceEntities(hass: HomeAssistant, deviceId: string): Record<string, string> {
  if (!hass || !deviceId) return {};

  // 1. Resolve from the Home Assistant frontend Entity Registry if available (cached).
  if (hass.entities) {
    let perDevice = registryCache.get(hass.entities);
    if (!perDevice) {
      perDevice = new Map();
      registryCache.set(hass.entities, perDevice);
    }
    const cached = perDevice.get(deviceId);
    if (cached) return cached;

    const deviceEntities = Object.values(hass.entities)
      .filter((e) => e.device_id === deviceId)
      .map((e) => e.entity_id);

    if (deviceEntities.length > 0) {
      const mapped = mapEntitiesBySuffix(deviceEntities);
      perDevice.set(deviceId, mapped);
      return mapped;
    }
  }

  // 2. Fallback: Search hass.states for entities sharing the same station_id
  // attribute. Not cached because hass.states changes on every state update.
  const stateEntities: string[] = [];
  for (const entityId of Object.keys(hass.states)) {
    const stateObj = hass.states[entityId];
    if (stateObj?.attributes?.station_id && String(stateObj.attributes.station_id) === String(deviceId)) {
      stateEntities.push(entityId);
    }
  }
  return mapEntitiesBySuffix(stateEntities);
}

/**
 * Returns a color associated with an EV charging network.
 */
export function getNetworkColor(network: string): string {
  return getNetworkBrand(network)?.color ?? 'var(--primary-color)';
}

/**
 * Returns a logo for an EV network. Tesla and Shell render as their
 * official CC0 vector marks (Simple Icons); other known networks render
 * as a colored text pill in the brand color; unknown networks fall back
 * to the generic ev-station icon.
 */
export function getNetworkLogo(network: string): TemplateResult {
  const brand = getNetworkBrand(network);
  if (!brand) {
    return html`<ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>`;
  }
  if (brand.svgPath) {
    return html`
      <svg
        class="network-svg"
        viewBox="0 0 24 24"
        role="img"
        aria-label="${brand.name}"
        style="fill: ${brand.color}"
      >
        <title>${brand.name}</title>
        <path d="${brand.svgPath}" />
      </svg>
    `;
  }
  return html`
    <span class="network-pill" style="background: ${brand.color}" role="img" aria-label="${brand.name}">
      ${brand.name}
    </span>
  `;
}

// Currencies the gasbuddy integration may report. Anything else falls back to USD.
const KNOWN_CURRENCIES = new Set(['USD', 'CAD', 'EUR', 'GBP', 'AUD', 'MXN', 'JPY']);

/**
 * Parses a leading ISO-4217 currency code out of a unit_of_measurement
 * like "USD/gallon" or "CAD/liter". Returns null when none is recognized.
 */
export function parseCurrency(unitOfMeasurement?: string | null): string | null {
  if (!unitOfMeasurement) return null;
  const code = unitOfMeasurement.trim().slice(0, 3).toUpperCase();
  return KNOWN_CURRENCIES.has(code) ? code : null;
}

/**
 * Formats a fuel price. Derives the currency from the sensor's
 * unit_of_measurement so non-USD users render correctly; defaults to USD.
 */
export function formatPrice(price: unknown, unitOfMeasurement?: string | null): string {
  if (price === undefined || price === null || price === 'unknown' || price === 'unavailable') {
    return '-';
  }
  const val = Number(price);
  if (isNaN(val)) return String(price);

  const currency = parseCurrency(unitOfMeasurement) ?? 'USD';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(val);
}

/**
 * Formats a distance value. The gasbuddy integration always reports miles
 * via the `distance_miles` attribute, so we convert to km when the user's
 * HA unit system is metric.
 */
export function formatDistance(distanceMiles: unknown, hass?: HomeAssistant): string {
  if (
    distanceMiles === undefined ||
    distanceMiles === null ||
    distanceMiles === 'unknown' ||
    distanceMiles === 'unavailable'
  ) {
    return '';
  }
  const miles = Number(distanceMiles);
  if (isNaN(miles)) return String(distanceMiles);

  const lengthUnit = hass?.config?.unit_system?.length;
  if (lengthUnit === 'km') {
    const km = miles * 1.609344;
    return `${km.toFixed(1)} km`;
  }
  return `${miles.toFixed(1)} mi`;
}

export function formatTrendWindow(hass: HomeAssistant | undefined, hours: number): string {
  if (hours <= 0) return '';
  const isWholeDays = hours % 24 === 0;
  const value = isWholeDays ? hours / 24 : hours;
  const unit = isWholeDays ? t(hass, 'trend_window_days') : t(hass, 'trend_window_hours');
  return ` · ${value}${unit}`;
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
    if (diffMs < 0) return 'Just now';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
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
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Visa" role="img" aria-label="Visa accepted">
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
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Mastercard" role="img" aria-label="Mastercard accepted">
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
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="American Express" role="img" aria-label="American Express accepted">
          <rect width="36" height="24" rx="3" fill="#006FCF"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="9" letter-spacing="0.5">AMEX</text>
        </svg>
      `);
      added.add('amex');
    } else if ((token === 'd' || token.includes('discover')) && !added.has('discover')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Discover" role="img" aria-label="Discover accepted">
          <rect width="36" height="24" rx="3" fill="#F05A28"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7" letter-spacing="0.5">DISCOVER</text>
        </svg>
      `);
      added.add('discover');
    } else if (token.includes('debit') && !added.has('debit')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Debit Card" role="img" aria-label="Debit card accepted">
          <rect width="36" height="24" rx="3" fill="#008080"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">DEBIT</text>
        </svg>
      `);
      added.add('debit');
    } else if (token.includes('credit') && !added.has('credit')) {
      icons.push(html`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Credit Card" role="img" aria-label="Credit card accepted">
          <rect width="36" height="24" rx="3" fill="#4B5563"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">CREDIT</text>
        </svg>
      `);
      added.add('credit');
    }
  }

  return icons;
}

export interface HistoryPoint {
  s?: string;
  t?: number;
  lu?: number;
  lc?: number;
  state?: string;
  last_updated?: string | number;
  last_changed?: string | number;
}

export interface SVGPathResult {
  stroke: string;
  fill: string;
}

export interface PriceTrend {
  // Direction relative to the baseline: down (price dropped — good for the
  // driver) / up / flat (within ±FLAT_THRESHOLD_PERCENT).
  direction: 'down' | 'up' | 'flat';
  // Absolute percent change between baseline and latest. Always positive.
  percent: number;
  // The two raw values used to compute the trend, for display/debug.
  baseline: number;
  latest: number;
  // Approximate hours actually compared (closest history point we found
  // before `baselineHours` ago — may differ if data is sparse).
  hoursCompared: number;
}

// How far either side of zero counts as "flat" to avoid noisy ±0.0% arrows.
const FLAT_THRESHOLD_PERCENT = 0.5;

/**
 * Parses a history dataset into normalized (value, timeSeconds) points,
 * filtering out non-numeric states. Supports both shorthand (s/t/lu/lc)
 * and standard (state/last_updated/last_changed) HA history shapes plus
 * numeric-string timestamps. Shared by sparkline + trend computation so
 * the two stay consistent.
 */
function parseHistoryPoints(history: HistoryPoint[] | undefined): Array<{ val: number; time: number }> {
  if (!history || history.length === 0) return [];
  const out: Array<{ val: number; time: number }> = [];
  for (const d of history) {
    const stateStr = d.s !== undefined ? d.s : d.state;
    const rawTime =
      d.t !== undefined ? d.t
      : d.lu !== undefined ? d.lu
      : d.lc !== undefined ? d.lc
      : d.last_updated !== undefined ? d.last_updated
      : d.last_changed;

    const val = Number(stateStr);
    let time = NaN;
    if (typeof rawTime === 'number') {
      time = rawTime;
    } else if (typeof rawTime === 'string') {
      const parsedNum = Number(rawTime);
      if (!isNaN(parsedNum)) {
        time = parsedNum;
      } else {
        time = Date.parse(rawTime) / 1000;
      }
    }
    if (!isNaN(val) && !isNaN(time)) {
      out.push({ val, time });
    }
  }
  return out;
}

/**
 * Computes the price-trend direction and magnitude relative to a baseline
 * `baselineHours` ago. Returns null when the history is too sparse to
 * compare meaningfully (no points, only one valid point, or baseline
 * value is zero so the percent change is undefined).
 *
 * "Latest" is the most-recently-timestamped valid point. "Baseline" is
 * the valid point with the smallest absolute time delta from
 * (latest.time − baselineHours), so a request for 24h compared against a
 * dataset that only has a 36h-old next-oldest point still returns
 * something useful and reports it via `hoursCompared`.
 */
export function computePriceTrend(
  history: HistoryPoint[] | undefined,
  baselineHours: number,
): PriceTrend | null {
  const points = parseHistoryPoints(history);
  if (points.length < 2) return null;

  let latest = points[0];
  for (const p of points) {
    if (p.time > latest.time) latest = p;
  }

  const targetTime = latest.time - baselineHours * 3600;
  let baseline = points[0];
  let bestDelta = Infinity;
  for (const p of points) {
    if (p === latest) continue;
    const delta = Math.abs(p.time - targetTime);
    if (delta < bestDelta) {
      bestDelta = delta;
      baseline = p;
    }
  }

  if (baseline === latest) return null;
  if (baseline.val === 0) return null;

  const pctChange = ((latest.val - baseline.val) / baseline.val) * 100;
  const abs = Math.abs(pctChange);
  const direction: PriceTrend['direction'] =
    abs < FLAT_THRESHOLD_PERCENT ? 'flat' : pctChange > 0 ? 'up' : 'down';

  return {
    direction,
    percent: abs,
    baseline: baseline.val,
    latest: latest.val,
    hoursCompared: Math.abs(latest.time - baseline.time) / 3600,
  };
}

/**
 * Generates SVG path commands (stroke and fill) for a given history dataset.
 * Fits coordinates into viewBox 0 0 100 50.
 */
export function generateSparklinePaths(
  history: HistoryPoint[],
  minY: number = 40,
  maxY: number = 10,
): SVGPathResult {
  if (!history || history.length === 0) {
    return { stroke: '', fill: '' };
  }

  // Parse points, filtering out non-numeric states, supporting both shorthand and standard keys
  const points = history
    .map((d) => {
      const stateStr = d.s !== undefined ? d.s : d.state;
      const rawTime = d.t !== undefined ? d.t : (d.lu !== undefined ? d.lu : (d.lc !== undefined ? d.lc : (d.last_updated !== undefined ? d.last_updated : d.last_changed)));

      const val = Number(stateStr);
      let time = NaN;
      if (typeof rawTime === 'number') {
        time = rawTime;
      } else if (typeof rawTime === 'string') {
        const parsedNum = Number(rawTime);
        if (!isNaN(parsedNum)) {
          time = parsedNum;
        } else {
          time = Date.parse(rawTime) / 1000;
        }
      }

      return { val, time };
    })
    .filter((d) => !isNaN(d.val) && !isNaN(d.time));

  if (points.length === 0) {
    return { stroke: '', fill: '' };
  }

  // Sort points chronologically to guarantee left-to-right drawing and correct curve calculations
  points.sort((a, b) => a.time - b.time);

  // If there's only 1 point, make a flat line spanning across
  if (points.length === 1) {
    const y = (minY + maxY) / 2;
    return {
      stroke: `M 0,${y} L 100,${y}`,
      fill: `M 0,${y} L 100,${y} L 100,50 L 0,50 Z`,
    };
  }

  // Find min/max time & val in a single pass per axis. `Math.min(...arr)` /
  // `Math.max(...arr)` would stack-overflow in some browsers when the spread
  // exceeds the engine's argument limit (~125k on V8). Price history won't
  // realistically hit that, but the reduction version is cheap, allocation-
  // free, and removes the only spread-on-array call in the codebase.
  let minTime = points[0].time;
  let maxTime = points[0].time;
  let minVal = points[0].val;
  let maxVal = points[0].val;
  for (let i = 1; i < points.length; i++) {
    const { time, val } = points[i];
    if (time < minTime) minTime = time;
    else if (time > maxTime) maxTime = time;
    if (val < minVal) minVal = val;
    else if (val > maxVal) maxVal = val;
  }

  const timeDiff = maxTime - minTime || 1;
  const valDiff = maxVal - minVal || 1;

  // Map each point to coordinates [0, 100] for X and [minY, maxY] for Y
  const coords = points.map((p) => {
    const x = ((p.time - minTime) / timeDiff) * 100;
    const y = minVal === maxVal
      ? (minY + maxY) / 2
      : minY - ((p.val - minVal) / valDiff) * (minY - maxY);
    return { x, y };
  });

  const strokeSegments: string[] = [];
  strokeSegments.push(`M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`);

  const controlPoint = (
    current: { x: number; y: number },
    previous: { x: number; y: number } | undefined,
    next: { x: number; y: number } | undefined,
    isEnd: boolean,
  ) => {
    const p = previous || current;
    const n = next || current;
    
    // Angle of the tangent is determined by the vector from previous to next
    const tangentX = n.x - p.x;
    const tangentY = n.y - p.y;
    const angle = Math.atan2(tangentY, tangentX);
    
    // Distance is calculated from the adjacent point in the current segment
    const adjacent = isEnd ? p : n;
    const dx = adjacent.x - current.x;
    const dy = adjacent.y - current.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    
    const smoothing = 0.2;
    const dist = segmentLength * smoothing;
    
    const cx = current.x + Math.cos(angle + (isEnd ? Math.PI : 0)) * dist;
    const cy = current.y + Math.sin(angle + (isEnd ? Math.PI : 0)) * dist;
    return { x: cx, y: cy };
  };

  for (let i = 0; i < coords.length - 1; i++) {
    const cp1 = controlPoint(coords[i], coords[i - 1], coords[i + 1], false);
    const cp2 = controlPoint(coords[i + 1], coords[i], coords[i + 2], true);
    strokeSegments.push(
      `C ${cp1.x.toFixed(1)},${cp1.y.toFixed(1)} ${cp2.x.toFixed(1)},${cp2.y.toFixed(1)} ${coords[i + 1].x.toFixed(1)},${coords[i + 1].y.toFixed(1)}`
    );
  }

  const stroke = strokeSegments.join(' ');

  const firstX = coords[0].x.toFixed(1);
  const lastX = coords[coords.length - 1].x.toFixed(1);
  const fill = `${stroke} L ${lastX},50 L ${firstX},50 Z`;

  return { stroke, fill };
}

export interface SparklineExtreme {
  // Normalized viewBox coordinates (0..100 horizontal, 0..50 vertical).
  x: number;
  y: number;
  // The original sensor value at this point.
  value: number;
}

export interface SparklineExtremes {
  min: SparklineExtreme;
  max: SparklineExtreme;
}

/**
 * Returns the lowest- and highest-value points in `history` mapped into
 * the same `0 0 100 50` viewBox that generateSparklinePaths plots into,
 * so a caller can drop a marker (e.g. `<circle cx cy>`) directly on top
 * of the sparkline at those positions.
 *
 * Returns null when:
 *  - history is empty or has no numeric points (nothing to mark)
 *  - all values are equal (no meaningful min vs max)
 *  - only one valid point exists (the sparkline draws a flat line; a
 *    marker would be redundant)
 *
 * minY / maxY default to the same 40 / 10 that generateSparklinePaths
 * uses, so callers don't have to repeat them.
 */
export function getSparklineExtremes(
  history: HistoryPoint[] | undefined,
  minY: number = 40,
  maxY: number = 10,
): SparklineExtremes | null {
  if (!history || history.length === 0) return null;

  const points: Array<{ val: number; time: number }> = [];
  for (const d of history) {
    const stateStr = d.s !== undefined ? d.s : d.state;
    const rawTime =
      d.t !== undefined ? d.t
      : d.lu !== undefined ? d.lu
      : d.lc !== undefined ? d.lc
      : d.last_updated !== undefined ? d.last_updated
      : d.last_changed;
    const val = Number(stateStr);
    let time = NaN;
    if (typeof rawTime === 'number') {
      time = rawTime;
    } else if (typeof rawTime === 'string') {
      const parsedNum = Number(rawTime);
      time = isNaN(parsedNum) ? Date.parse(rawTime) / 1000 : parsedNum;
    }
    if (!isNaN(val) && !isNaN(time)) {
      points.push({ val, time });
    }
  }

  if (points.length < 2) return null;

  let minTime = points[0].time;
  let maxTime = points[0].time;
  let minIdx = 0;
  let maxIdx = 0;
  for (let i = 1; i < points.length; i++) {
    const { time, val } = points[i];
    if (time < minTime) minTime = time;
    else if (time > maxTime) maxTime = time;
    if (val < points[minIdx].val) minIdx = i;
    if (val > points[maxIdx].val) maxIdx = i;
  }

  // All values equal → no meaningful min/max to mark.
  if (points[minIdx].val === points[maxIdx].val) return null;

  const timeDiff = maxTime - minTime || 1;
  const valDiff = points[maxIdx].val - points[minIdx].val;

  const toCoord = (p: { val: number; time: number }) => ({
    x: ((p.time - minTime) / timeDiff) * 100,
    y: minY - ((p.val - points[minIdx].val) / valDiff) * (minY - maxY),
    value: p.val,
  });

  return {
    min: toCoord(points[minIdx]),
    max: toCoord(points[maxIdx]),
  };
}

export interface SparklinePointAt {
  // viewBox coords (0..100 / 0..50)
  x: number;
  y: number;
  // raw value at that point
  value: number;
  // unix seconds for the matched point (the time format generateSparklinePaths
  // also normalizes to)
  timeSeconds: number;
}

/**
 * Maps a viewBox X coordinate (0..100, same coordinate space as
 * generateSparklinePaths) to the nearest history point and returns its
 * coordinates plus raw value/time so a caller can draw a hover guide
 * line and a tooltip on it.
 *
 * Returns null when:
 *  - history is empty or has no numeric points
 *  - only one valid point exists (a flat-line sparkline; nothing to
 *    target on hover)
 *
 * `viewBoxX` is clamped to [0, 100] so out-of-range mouse positions
 * resolve to the closest endpoint.
 */
export function findNearestSparklinePoint(
  history: HistoryPoint[] | undefined,
  viewBoxX: number,
  minY: number = 40,
  maxY: number = 10,
): SparklinePointAt | null {
  if (!history || history.length === 0) return null;

  const points: Array<{ val: number; time: number }> = [];
  for (const d of history) {
    const stateStr = d.s !== undefined ? d.s : d.state;
    const rawTime =
      d.t !== undefined ? d.t
      : d.lu !== undefined ? d.lu
      : d.lc !== undefined ? d.lc
      : d.last_updated !== undefined ? d.last_updated
      : d.last_changed;
    const val = Number(stateStr);
    let time = NaN;
    if (typeof rawTime === 'number') {
      time = rawTime;
    } else if (typeof rawTime === 'string') {
      const parsedNum = Number(rawTime);
      time = isNaN(parsedNum) ? Date.parse(rawTime) / 1000 : parsedNum;
    }
    if (!isNaN(val) && !isNaN(time)) {
      points.push({ val, time });
    }
  }

  if (points.length < 2) return null;

  let minTime = points[0].time;
  let maxTime = points[0].time;
  let minVal = points[0].val;
  let maxVal = points[0].val;
  for (let i = 1; i < points.length; i++) {
    const { time, val } = points[i];
    if (time < minTime) minTime = time;
    else if (time > maxTime) maxTime = time;
    if (val < minVal) minVal = val;
    else if (val > maxVal) maxVal = val;
  }

  const clampedX = Math.max(0, Math.min(100, viewBoxX));
  const targetTime = minTime + (clampedX / 100) * (maxTime - minTime);

  let nearest = points[0];
  let bestDelta = Math.abs(nearest.time - targetTime);
  for (let i = 1; i < points.length; i++) {
    const d = Math.abs(points[i].time - targetTime);
    if (d < bestDelta) {
      bestDelta = d;
      nearest = points[i];
    }
  }

  const timeDiff = maxTime - minTime || 1;
  const valDiff = maxVal - minVal || 1;
  const x = ((nearest.time - minTime) / timeDiff) * 100;
  const y = minVal === maxVal ? (minY + maxY) / 2 : minY - ((nearest.val - minVal) / valDiff) * (minY - maxY);

  return { x, y, value: nearest.val, timeSeconds: nearest.time };
}
