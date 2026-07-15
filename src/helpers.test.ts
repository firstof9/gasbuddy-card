import { describe, expect, it } from 'vitest';
import {
  findDeviceEntities,
  formatDistance,
  formatPrice,
  formatTimestamp,
  formatTrendWindow,
  getNetworkColor,
  getPaymentIcons,
  generateSparklinePaths,
  computePriceTrend,
  getSparklineExtremes,
  findNearestSparklinePoint,
} from './helpers.js';
import type { HomeAssistant } from './types.js';

const buildHass = (overrides: Partial<HomeAssistant> = {}): HomeAssistant => ({
  states: {},
  entities: {},
  ...overrides,
});

describe('formatPrice', () => {
  it('renders a number as USD currency by default', () => {
    expect(formatPrice(3.459)).toBe('$3.459');
    expect(formatPrice(3.45)).toBe('$3.45');
  });

  it('returns "-" for unknown/unavailable/null/undefined', () => {
    expect(formatPrice(undefined)).toBe('-');
    expect(formatPrice(null)).toBe('-');
    expect(formatPrice('unknown')).toBe('-');
    expect(formatPrice('unavailable')).toBe('-');
  });

  it('passes through non-numeric strings unchanged', () => {
    expect(formatPrice('abc')).toBe('abc');
  });

  it('accepts numeric strings', () => {
    expect(formatPrice('3.45')).toBe('$3.45');
  });
});

describe('formatDistance', () => {
  it('renders miles with one decimal', () => {
    expect(formatDistance(2.345)).toBe('2.3 mi');
    expect(formatDistance(10)).toBe('10.0 mi');
  });

  it('returns empty string for unknown/unavailable/null/undefined', () => {
    expect(formatDistance(undefined)).toBe('');
    expect(formatDistance(null)).toBe('');
    expect(formatDistance('unknown')).toBe('');
    expect(formatDistance('unavailable')).toBe('');
  });

  it('passes through non-numeric strings', () => {
    expect(formatDistance('abc')).toBe('abc');
  });
});

describe('formatTrendWindow', () => {
  it('renders whole-day multiples as days', () => {
    expect(formatTrendWindow(buildHass(), 168)).toBe(' · 7d');
  });

  it('renders exactly 24h as one day', () => {
    expect(formatTrendWindow(buildHass(), 24)).toBe(' · 1d');
  });

  it('renders a sub-day hour count as hours', () => {
    expect(formatTrendWindow(buildHass(), 6)).toBe(' · 6h');
  });

  it('renders a non-day-multiple multi-day hour count as hours', () => {
    expect(formatTrendWindow(buildHass(), 36)).toBe(' · 36h');
  });

  it('returns empty string for zero hours', () => {
    expect(formatTrendWindow(buildHass(), 0)).toBe('');
  });

  it('returns empty string for negative hours', () => {
    expect(formatTrendWindow(buildHass(), -1)).toBe('');
  });
});

describe('formatTimestamp', () => {
  it('returns "Just now" for very recent timestamps', () => {
    const now = Date.now();
    expect(formatTimestamp(new Date(now - 5_000).toISOString())).toBe('Just now');
  });

  it('returns minutes for sub-hour deltas', () => {
    const now = Date.now();
    expect(formatTimestamp(new Date(now - 5 * 60_000).toISOString())).toBe('5m ago');
  });

  it('returns hours for sub-day deltas', () => {
    const now = Date.now();
    expect(formatTimestamp(new Date(now - 3 * 3_600_000).toISOString())).toBe('3h ago');
  });

  it('returns days with correct pluralization', () => {
    const now = Date.now();
    expect(formatTimestamp(new Date(now - 1 * 86_400_000).toISOString())).toBe('1 day ago');
    expect(formatTimestamp(new Date(now - 3 * 86_400_000).toISOString())).toBe('3 days ago');
  });

  it('returns weeks for week-range deltas', () => {
    const now = Date.now();
    const oneWeek = 7 * 86_400_000;
    expect(formatTimestamp(new Date(now - oneWeek).toISOString())).toBe('1 week ago');
    expect(formatTimestamp(new Date(now - 3 * oneWeek).toISOString())).toBe('3 weeks ago');
  });

  it('handles invalid input gracefully', () => {
    expect(formatTimestamp(undefined)).toBe('Unknown');
    expect(formatTimestamp(null)).toBe('Unknown');
    expect(formatTimestamp('unknown')).toBe('Unknown');
    expect(formatTimestamp('not-a-date')).toBe('not-a-date');
  });

  it('treats future timestamps as "Just now"', () => {
    const now = Date.now();
    expect(formatTimestamp(new Date(now + 60_000).toISOString())).toBe('Just now');
  });
});

describe('findDeviceEntities', () => {
  it('returns empty mapping when no entities or device id', () => {
    expect(findDeviceEntities(buildHass(), 'dev1')).toEqual({});
    expect(findDeviceEntities(buildHass({ entities: { e1: { entity_id: 'e1' } } }), '')).toEqual({});
  });

  it('maps recognized suffixes from the entity registry', () => {
    const hass = buildHass({
      entities: {
        'sensor.shell_42_regular_gas': { entity_id: 'sensor.shell_42_regular_gas', device_id: 'dev1' },
        'sensor.shell_42_diesel': { entity_id: 'sensor.shell_42_diesel', device_id: 'dev1' },
        'sensor.shell_42_ev_dc_fast_chargers': {
          entity_id: 'sensor.shell_42_ev_dc_fast_chargers',
          device_id: 'dev1',
        },
        'sensor.unrelated_thing': { entity_id: 'sensor.unrelated_thing', device_id: 'other' },
      },
    });
    const mapped = findDeviceEntities(hass, 'dev1');
    expect(mapped.regular_gas).toBe('sensor.shell_42_regular_gas');
    expect(mapped.diesel).toBe('sensor.shell_42_diesel');
    expect(mapped.ev_dc_fast).toBe('sensor.shell_42_ev_dc_fast_chargers');
    expect(mapped).not.toHaveProperty('unrelated_thing');
  });

  it('falls back to station_id attribute when entity registry is missing', () => {
    const hass = buildHass({
      states: {
        'sensor.station_a_regular_gas': {
          state: '3.49',
          attributes: { station_id: 'dev1' },
        },
        'sensor.station_b_regular_gas': {
          state: '3.59',
          attributes: { station_id: 'dev2' },
        },
      },
      entities: undefined,
    });
    const mapped = findDeviceEntities(hass, 'dev1');
    expect(mapped.regular_gas).toBe('sensor.station_a_regular_gas');
  });

  it('handles the e15/UNL88 alias variants', () => {
    const hass = buildHass({
      entities: {
        'sensor.x_unl88': { entity_id: 'sensor.x_unl88', device_id: 'dev1' },
        'sensor.x_unl88_cash': { entity_id: 'sensor.x_unl88_cash', device_id: 'dev1' },
      },
    });
    const mapped = findDeviceEntities(hass, 'dev1');
    expect(mapped.e15).toBe('sensor.x_unl88');
    expect(mapped.e15_cash).toBe('sensor.x_unl88_cash');
  });

  it('handles the deal price variants', () => {
    const hass = buildHass({
      entities: {
        'sensor.x_regular_gas_deal': { entity_id: 'sensor.x_regular_gas_deal', device_id: 'dev1' },
        'sensor.x_unl88_deal': { entity_id: 'sensor.x_unl88_deal', device_id: 'dev1' },
      },
    });
    const mapped = findDeviceEntities(hass, 'dev1');
    expect(mapped.regular_gas_deal).toBe('sensor.x_regular_gas_deal');
    expect(mapped.e15_deal).toBe('sensor.x_unl88_deal');
  });

  it('handles the station_name variant', () => {
    const hass = buildHass({
      entities: {
        'sensor.cheapest_gas_station_name': { entity_id: 'sensor.cheapest_gas_station_name', device_id: 'dev1' },
      },
    });
    const mapped = findDeviceEntities(hass, 'dev1');
    expect(mapped.station_name).toBe('sensor.cheapest_gas_station_name');
  });
});

describe('getNetworkColor', () => {
  it('returns brand-specific colors for known networks', () => {
    expect(getNetworkColor('Tesla')).toBe('#cc0000');
    expect(getNetworkColor('ChargePoint')).toBe('#40b83c');
    expect(getNetworkColor('EVgo')).toBe('#0055ff');
    expect(getNetworkColor('Electrify America')).toBe('#00a261');
    expect(getNetworkColor('Blink')).toBe('#0066cc');
  });

  it('is case-insensitive and tolerates surrounding text', () => {
    expect(getNetworkColor('tesla supercharger network')).toBe('#cc0000');
    expect(getNetworkColor('CHARGEPOINT')).toBe('#40b83c');
  });

  it('falls back to the HA primary color for unknown networks', () => {
    expect(getNetworkColor('')).toBe('var(--primary-color)');
    expect(getNetworkColor('Unknown Net')).toBe('var(--primary-color)');
  });
});

describe('getPaymentIcons', () => {
  it('returns no icons for empty input', () => {
    expect(getPaymentIcons('')).toEqual([]);
  });

  it('emits one icon per recognized token, deduping repeats', () => {
    expect(getPaymentIcons('visa').length).toBe(1);
    expect(getPaymentIcons('visa, mastercard').length).toBe(2);
    expect(getPaymentIcons('visa visa visa').length).toBe(1);
  });

  it('recognizes single-letter shorthand and common aliases', () => {
    expect(getPaymentIcons('v m a d').length).toBe(4);
    expect(getPaymentIcons('amex american express').length).toBe(1);
    expect(getPaymentIcons('mastercard master').length).toBe(1);
  });

  it('recognizes debit and credit tokens', () => {
    expect(getPaymentIcons('debit credit').length).toBe(2);
  });

  it('ignores unrecognized tokens', () => {
    expect(getPaymentIcons('cash check carrier_pigeon').length).toBe(0);
  });
});

describe('generateSparklinePaths', () => {
  it('returns empty paths for empty or undefined history', () => {
    expect(generateSparklinePaths([])).toEqual({ stroke: '', fill: '' });
    expect(generateSparklinePaths(undefined as any)).toEqual({ stroke: '', fill: '' });
  });

  it('filters out non-numeric points', () => {
    expect(generateSparklinePaths([
      { s: 'unknown', t: 100 },
      { s: 'unavailable', t: 200 }
    ])).toEqual({ stroke: '', fill: '' });
  });

  it('renders a horizontal line for a single valid data point', () => {
    expect(generateSparklinePaths([{ s: '3.50', t: 100 }])).toEqual({
      stroke: 'M 0,25 L 100,25',
      fill: 'M 0,25 L 100,25 L 100,50 L 0,50 Z',
    });
  });

  it('renders a horizontal line when all points have the same value', () => {
    expect(generateSparklinePaths([
      { s: '3.50', t: 100 },
      { s: '3.50', t: 200 },
      { s: '3.50', t: 300 }
    ])).toEqual({
      stroke: 'M 0.0,25.0 C 10.0,25.0 40.0,25.0 50.0,25.0 C 60.0,25.0 90.0,25.0 100.0,25.0',
      fill: 'M 0.0,25.0 C 10.0,25.0 40.0,25.0 50.0,25.0 C 60.0,25.0 90.0,25.0 100.0,25.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('scales multiple points correctly within the viewBox coordinates', () => {
    const history = [
      { s: '3.00', t: 1000 }, // min val
      { s: '3.50', t: 2000 },
      { s: '4.00', t: 3000 }  // max val
    ];
    // With default minY=40, maxY=10, Y range is 30.
    // Time diff is 2000. X maps 1000->0, 2000->50, 3000->100.
    // Price maps 3.00->40, 3.50->25, 4.00->10.
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 10.0,37.0 40.0,28.0 50.0,25.0 C 60.0,22.0 90.0,13.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 10.0,37.0 40.0,28.0 50.0,25.0 C 60.0,22.0 90.0,13.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('supports standard state and ISO last_updated timestamps', () => {
    const history = [
      { state: '3.00', last_updated: '2026-05-24T20:00:00.000Z' },
      { state: '4.00', last_updated: '2026-05-24T21:00:00.000Z' }
    ];
    // 2026-05-24T20:00:00.000Z parsed to epoch seconds: 1779652800
    // 2026-05-24T21:00:00.000Z parsed to epoch seconds: 1779656400
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('supports Home Assistant optimized s and lu keys', () => {
    const history = [
      { s: '3.00', lu: 1716300000 },
      { s: '4.00', lu: 1716386400 }
    ];
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('falls back to lc when t and lu are absent', () => {
    const history = [
      { s: '3.00', lc: 1000 },
      { s: '4.00', lc: 2000 },
    ];
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('falls back to last_changed when no other timestamp key is set', () => {
    const history = [
      { state: '3.00', last_changed: '2026-05-24T20:00:00.000Z' },
      { state: '4.00', last_changed: '2026-05-24T21:00:00.000Z' },
    ];
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('prefers t over lu when both are present', () => {
    // If lu were used, the points would map to different x positions.
    // With t winning, both points share t=1000 so the single-point
    // flat-line branch should trigger.
    const history = [
      { s: '3.00', t: 1000, lu: 5000 },
      { s: '4.00', t: 1000, lu: 9000 },
    ];
    // Both points share the same time, so timeDiff = 0 → divides by 1.
    // Both map to x=0; values still differ so y splits.
    const result = generateSparklinePaths(history);
    expect(result.stroke.startsWith('M 0.0,')).toBe(true);
    expect(result.stroke).toContain('C 0.0,');
  });

  it('parses numeric-string timestamps', () => {
    const history = [
      { s: '3.00', t: '1000' as unknown as number },
      { s: '4.00', t: '2000' as unknown as number },
    ];
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('drops invalid points but keeps the valid ones', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: 'unavailable', t: 1500 },
      { s: '4.00', t: 2000 },
      { s: 'unknown', t: 2500 },
    ];
    // Should behave as a 2-point line from the surviving entries.
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('honours custom minY and maxY parameters', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: '4.00', t: 2000 },
    ];
    // minY=30, maxY=20 → Y range is 10; value 3 → 30, value 4 → 20.
    expect(generateSparklinePaths(history, 30, 20)).toEqual({
      stroke: 'M 0.0,30.0 C 20.0,28.0 80.0,22.0 100.0,20.0',
      fill: 'M 0.0,30.0 C 20.0,28.0 80.0,22.0 100.0,20.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('uses the midpoint of custom range when all values are equal', () => {
    const history = [
      { s: '3.50', t: 1000 },
      { s: '3.50', t: 2000 },
    ];
    // (30 + 20) / 2 = 25
    expect(generateSparklinePaths(history, 30, 20)).toEqual({
      stroke: 'M 0.0,25.0 C 20.0,25.0 80.0,25.0 100.0,25.0',
      fill: 'M 0.0,25.0 C 20.0,25.0 80.0,25.0 100.0,25.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('handles points where state-keyed and t-keyed forms are mixed', () => {
    const history = [
      { state: '3.00', last_updated: 1000 },
      { s: '4.00', t: 2000 },
    ];
    expect(generateSparklinePaths(history)).toEqual({
      stroke: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0',
      fill: 'M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });

  it('renders correctly when points are not sorted by time', () => {
    // The function uses min/max time, not array order, for X mapping.
    // It sorts points chronologically first to guarantee left-to-right Bezier.
    const history = [
      { s: '4.00', t: 2000 },
      { s: '3.00', t: 1000 },
    ];
    const { stroke } = generateSparklinePaths(history);
    expect(stroke).toBe('M 0.0,40.0 C 20.0,34.0 80.0,16.0 100.0,10.0');
  });
});

describe('computePriceTrend', () => {
  // 1h = 3600s in the synthetic timestamps below.
  const HOUR = 3600;

  it('returns null for missing or too-sparse history', () => {
    expect(computePriceTrend(undefined, 24)).toBeNull();
    expect(computePriceTrend([], 24)).toBeNull();
    expect(computePriceTrend([{ s: '3.00', t: 1000 }], 24)).toBeNull();
  });

  it('returns null when only one valid numeric point survives parsing', () => {
    expect(
      computePriceTrend(
        [
          { s: '3.00', t: 1000 },
          { s: 'unavailable', t: 2000 },
          { s: 'unknown', t: 3000 },
        ],
        24,
      ),
    ).toBeNull();
  });

  it('returns null when the baseline value is zero', () => {
    expect(
      computePriceTrend(
        [
          { s: '0', t: 1000 },
          { s: '3.00', t: 1000 + 24 * HOUR },
        ],
        24,
      ),
    ).toBeNull();
  });

  it('reports a downward trend when latest < baseline (good for the driver)', () => {
    const result = computePriceTrend(
      [
        { s: '4.00', t: 0 },
        { s: '3.00', t: 24 * HOUR },
      ],
      24,
    )!;
    expect(result.direction).toBe('down');
    expect(result.percent).toBeCloseTo(25, 5);
    expect(result.baseline).toBe(4.0);
    expect(result.latest).toBe(3.0);
    expect(result.hoursCompared).toBe(24);
  });

  it('reports an upward trend when latest > baseline', () => {
    const result = computePriceTrend(
      [
        { s: '3.00', t: 0 },
        { s: '3.60', t: 24 * HOUR },
      ],
      24,
    )!;
    expect(result.direction).toBe('up');
    expect(result.percent).toBeCloseTo(20, 5);
  });

  it('reports flat when change is below the threshold (~0.5%)', () => {
    const result = computePriceTrend(
      [
        { s: '3.00', t: 0 },
        { s: '3.005', t: 24 * HOUR },
      ],
      24,
    )!;
    expect(result.direction).toBe('flat');
    expect(result.percent).toBeLessThan(0.5);
  });

  it('picks the closest available baseline when no point sits at exactly N hours ago', () => {
    // History at t=0, 12h, 24h, 36h. Asking for 24h baseline should
    // pick the 24h point (delta 0), not the 12h or 36h points.
    const history = [
      { s: '3.00', t: 0 },
      { s: '3.20', t: 12 * HOUR },
      { s: '3.50', t: 24 * HOUR },
      { s: '4.00', t: 48 * HOUR },
    ];
    const result = computePriceTrend(history, 24)!;
    expect(result.baseline).toBe(3.5);
    expect(result.latest).toBe(4.0);
    expect(result.hoursCompared).toBe(24);
  });

  it('reports the actual hoursCompared when data is sparser than requested', () => {
    // History at t=0 and t=36h. Asking for 24h finds only 36h-old point
    // as the closest non-latest entry.
    const result = computePriceTrend(
      [
        { s: '3.00', t: 0 },
        { s: '4.00', t: 36 * HOUR },
      ],
      24,
    )!;
    expect(result.hoursCompared).toBe(36);
  });

  it('uses the most-recently-timestamped point as "latest" regardless of array order', () => {
    const result = computePriceTrend(
      [
        { s: '3.00', t: 24 * HOUR }, // latest in time, listed first
        { s: '4.00', t: 0 },
      ],
      24,
    )!;
    expect(result.latest).toBe(3.0);
    expect(result.baseline).toBe(4.0);
    expect(result.direction).toBe('down');
  });

  it('supports the standard state/last_updated fields', () => {
    const baselineIso = new Date('2026-05-24T20:00:00.000Z').toISOString();
    const latestIso = new Date('2026-05-25T20:00:00.000Z').toISOString();
    const result = computePriceTrend(
      [
        { state: '4.00', last_updated: baselineIso },
        { state: '3.00', last_updated: latestIso },
      ],
      24,
    )!;
    expect(result.direction).toBe('down');
    expect(result.percent).toBeCloseTo(25, 5);
  });
});

describe('getSparklineExtremes', () => {
  it('returns null for empty or undefined history', () => {
    expect(getSparklineExtremes(undefined)).toBeNull();
    expect(getSparklineExtremes([])).toBeNull();
  });

  it('returns null when fewer than 2 valid points survive parsing', () => {
    expect(getSparklineExtremes([{ s: '3.50', t: 100 }])).toBeNull();
    expect(
      getSparklineExtremes([
        { s: '3.50', t: 100 },
        { s: 'unavailable', t: 200 },
      ]),
    ).toBeNull();
  });

  it('returns null when all values are equal (no meaningful extremes)', () => {
    expect(
      getSparklineExtremes([
        { s: '3.50', t: 100 },
        { s: '3.50', t: 200 },
        { s: '3.50', t: 300 },
      ]),
    ).toBeNull();
  });

  it('maps min and max into the same default viewBox as the sparkline', () => {
    // Two points: t=1000 → x=0, t=2000 → x=100; val=3 → minVal → y=40,
    // val=4 → maxVal → y=10. Min point coords ≈ (0, 40), max ≈ (100, 10).
    const extremes = getSparklineExtremes([
      { s: '3.00', t: 1000 },
      { s: '4.00', t: 2000 },
    ])!;
    expect(extremes.min).toEqual({ x: 0, y: 40, value: 3.0 });
    expect(extremes.max).toEqual({ x: 100, y: 10, value: 4.0 });
  });

  it('honors custom minY and maxY parameters', () => {
    // minY=30, maxY=20 → Y range 10; val 3 → 30 (min), val 4 → 20 (max).
    const extremes = getSparklineExtremes(
      [
        { s: '3.00', t: 1000 },
        { s: '4.00', t: 2000 },
      ],
      30,
      20,
    )!;
    expect(extremes.min.y).toBe(30);
    expect(extremes.max.y).toBe(20);
  });

  it('picks the right extremes when min/max are not at the endpoints', () => {
    // Order: 3.50 (between), 3.00 (min), 4.00 (max), 3.20 (between).
    const extremes = getSparklineExtremes([
      { s: '3.50', t: 1000 },
      { s: '3.00', t: 2000 },
      { s: '4.00', t: 3000 },
      { s: '3.20', t: 4000 },
    ])!;
    expect(extremes.min.value).toBe(3.0);
    expect(extremes.max.value).toBe(4.0);
    // Time mapping: t=1000→0, t=2000→33.3, t=3000→66.7, t=4000→100.
    expect(extremes.min.x).toBeCloseTo(33.33, 1);
    expect(extremes.max.x).toBeCloseTo(66.67, 1);
  });

  it('supports the standard state/last_updated keys', () => {
    const extremes = getSparklineExtremes([
      { state: '3.00', last_updated: '2026-05-24T20:00:00.000Z' },
      { state: '4.00', last_updated: '2026-05-24T21:00:00.000Z' },
    ])!;
    expect(extremes.min.value).toBe(3.0);
    expect(extremes.max.value).toBe(4.0);
  });

  it('drops invalid points and computes extremes over the survivors', () => {
    const extremes = getSparklineExtremes([
      { s: '3.00', t: 1000 },
      { s: 'unavailable', t: 1500 },
      { s: '4.00', t: 2000 },
      { s: 'unknown', t: 2500 },
    ])!;
    expect(extremes.min.value).toBe(3.0);
    expect(extremes.max.value).toBe(4.0);
  });
});

describe('findNearestSparklinePoint', () => {
  it('returns null for empty or single-point history', () => {
    expect(findNearestSparklinePoint(undefined, 50)).toBeNull();
    expect(findNearestSparklinePoint([], 50)).toBeNull();
    expect(findNearestSparklinePoint([{ s: '3.00', t: 1000 }], 50)).toBeNull();
  });

  it('returns null when fewer than 2 valid numeric points survive parsing', () => {
    expect(
      findNearestSparklinePoint(
        [
          { s: '3.00', t: 1000 },
          { s: 'unavailable', t: 2000 },
          { s: 'unknown', t: 3000 },
        ],
        50,
      ),
    ).toBeNull();
  });

  it('picks the leftmost point for viewBoxX=0 and rightmost for viewBoxX=100', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: '3.50', t: 2000 },
      { s: '4.00', t: 3000 },
    ];
    expect(findNearestSparklinePoint(history, 0)!.timeSeconds).toBe(1000);
    expect(findNearestSparklinePoint(history, 100)!.timeSeconds).toBe(3000);
  });

  it('picks the middle point for viewBoxX=50 on evenly-spaced history', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: '3.50', t: 2000 },
      { s: '4.00', t: 3000 },
    ];
    const nearest = findNearestSparklinePoint(history, 50)!;
    expect(nearest.timeSeconds).toBe(2000);
    expect(nearest.value).toBe(3.5);
  });

  it('clamps viewBoxX outside [0, 100] to the nearest endpoint', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: '4.00', t: 2000 },
    ];
    expect(findNearestSparklinePoint(history, -50)!.timeSeconds).toBe(1000);
    expect(findNearestSparklinePoint(history, 200)!.timeSeconds).toBe(2000);
  });

  it('returns viewBox coordinates that match the sparkline mapping', () => {
    // Three points at t=1000,2000,3000 with vals 3,3.5,4 — middle point
    // resolves to x≈50, y≈25 (midpoint of default 40..10 range).
    const history = [
      { s: '3.00', t: 1000 },
      { s: '3.50', t: 2000 },
      { s: '4.00', t: 3000 },
    ];
    const nearest = findNearestSparklinePoint(history, 50)!;
    expect(nearest.x).toBeCloseTo(50, 5);
    expect(nearest.y).toBeCloseTo(25, 5);
  });

  it('honours custom minY and maxY parameters', () => {
    const history = [
      { s: '3.00', t: 1000 },
      { s: '4.00', t: 2000 },
    ];
    // minY=30, maxY=20: max value 4 sits at y=20, min value 3 at y=30.
    expect(findNearestSparklinePoint(history, 0, 30, 20)!.y).toBe(30);
    expect(findNearestSparklinePoint(history, 100, 30, 20)!.y).toBe(20);
  });

  it('supports the standard state/last_updated keys', () => {
    const history = [
      { state: '3.00', last_updated: '2026-05-24T20:00:00.000Z' },
      { state: '4.00', last_updated: '2026-05-24T21:00:00.000Z' },
    ];
    const nearest = findNearestSparklinePoint(history, 0)!;
    expect(nearest.value).toBe(3.0);
    expect(nearest.timeSeconds).toBe(Date.parse('2026-05-24T20:00:00.000Z') / 1000);
  });
});
