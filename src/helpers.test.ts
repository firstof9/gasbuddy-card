import { describe, expect, it } from 'vitest';
import {
  findDeviceEntities,
  formatDistance,
  formatPrice,
  formatTimestamp,
  getNetworkColor,
  getPaymentIcons,
  generateSparklinePaths,
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
      stroke: 'M 0.0,25.0 L 50.0,25.0 L 100.0,25.0',
      fill: 'M 0.0,25.0 L 50.0,25.0 L 100.0,25.0 L 100.0,50 L 0.0,50 Z',
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
      stroke: 'M 0.0,40.0 L 50.0,25.0 L 100.0,10.0',
      fill: 'M 0.0,40.0 L 50.0,25.0 L 100.0,10.0 L 100.0,50 L 0.0,50 Z',
    });
  });
});

