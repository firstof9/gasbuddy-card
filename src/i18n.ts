import type { HomeAssistant } from './types.js';

/**
 * Translation dictionary for the GasBuddy card.
 *
 * Lookup precedence:
 *   1. hass.localize(`component.gasbuddy.card.<key>`) — lets the
 *      ha-gasbuddy integration ship translations alongside its own
 *      translation files in the future.
 *   2. The selected language's entry in TRANSLATIONS below.
 *   3. The English default.
 *
 * To add a language: add a record to TRANSLATIONS keyed by the
 * language code returned by hass.locale.language (e.g. `de`, `fr`).
 * Missing keys for a language silently fall through to English.
 */

const EN = {
  // Tab labels
  tab_gas: 'Gas Prices',
  tab_ev: 'EV Chargers',

  // Header / message text
  default_station_name: 'Gas Station',
  missing_device:
    'Please select a GasBuddy Device in the card configuration editor.',
  no_active_sensors:
    'No active sensors found for this GasBuddy device. Verify that the integration has loaded data successfully.',
  brand_logo_alt: 'Brand logo',

  // Fuel grades
  grade_regular: 'Regular',
  grade_midgrade: 'Midgrade',
  grade_premium: 'Premium',
  grade_diesel: 'Diesel',
  grade_unl88: 'UNL88',
  grade_e85: 'E85',

  // Price labels
  price_credit: 'Credit',
  price_cash: 'Cash',

  // EV charger levels
  charger_level1: 'Level 1',
  charger_level2: 'Level 2',
  charger_dc_fast: 'DC Fast',

  // EV section labels
  connectors_heading: 'Connectors',
  meta_network: 'Network',
  meta_status: 'Status',
  meta_pricing: 'Pricing',
  meta_access_hours: 'Access Hours',
  meta_payments: 'Payments',
  meta_last_confirmed: 'Last Confirmed',

  // Footer
  updated_prefix: 'Updated:',
  updated_recent: 'Recent',
} as const;

export type TranslationKey = keyof typeof EN;

const TRANSLATIONS: Record<string, Partial<Record<TranslationKey, string>>> = {
  en: EN,
  // Add additional languages here, e.g.:
  // de: { tab_gas: 'Kraftstoffpreise', ... },
};

export function t(hass: HomeAssistant | undefined, key: TranslationKey): string {
  // 1. Defer to hass.localize when the integration provides a matching key.
  const haKey = `component.gasbuddy.card.${key}`;
  const fromHa = hass?.localize?.(haKey);
  if (fromHa && fromHa !== haKey) return fromHa;

  // 2. Look up the user's language.
  const lang = hass?.locale?.language || hass?.language || 'en';
  const langDict = TRANSLATIONS[lang];
  if (langDict?.[key]) return langDict[key] as string;

  // 3. English default.
  return EN[key];
}
