import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { GasBuddyCardConfig, HomeAssistant } from './types.js';

interface HaFormFieldEntry {
  name: string;
  label?: string;
  helper?: string;
  selector: Record<string, unknown>;
}

interface HaFormExpandableEntry {
  type: 'expandable';
  name: string;
  title: string;
  icon?: string;
  expanded?: boolean;
  schema: HaFormFieldEntry[];
}

type HaFormSchemaEntry = HaFormFieldEntry | HaFormExpandableEntry;

const sensorOverride = (
  name: string,
  label: string,
): HaFormFieldEntry => ({
  name: `${name}_entity`,
  label: `${label} Override`,
  selector: { entity: { domain: 'sensor' } },
});

const SCHEMA: HaFormSchemaEntry[] = [
  // ── Basic ────────────────────────────────────────────────
  {
    name: 'device_id',
    label: 'GasBuddy Station / Device',
    helper: 'Select the GasBuddy station device configured in your Home Assistant.',
    selector: {
      device: {
        integration: 'gasbuddy',
      },
    },
  },
  {
    name: 'title',
    label: 'Card Title (Optional)',
    helper: 'Custom title shown at the top of the card. Falls back to the station name.',
    selector: { text: {} },
  },
  {
    name: 'default_mode',
    label: 'Default Tab',
    helper: 'Which tab the card opens on when both gas and EV data are present.',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'gas', label: 'Gas Prices' },
          { value: 'ev', label: 'EV Chargers' },
        ],
      },
    },
  },
  {
    name: 'show_trend_indicator',
    label: 'Show Trend Indicator',
    helper: 'Display an arrow + percent change next to each price.',
    selector: { boolean: {} },
  },
  {
    name: 'trend_indicator_baseline_hours',
    label: 'Trend Indicator Baseline (hours)',
    helper: 'Compare current price to N hours ago. Default 24.',
    selector: { number: { min: 1, max: 720, mode: 'box' } },
  },

  // ── Price trend graph ────────────────────────────────────
  {
    type: 'expandable',
    name: '_trend_section',
    title: 'Price Trend Graph',
    icon: 'mdi:chart-line',
    schema: [
      {
        name: 'show_trend',
        label: 'Show Background Trend Graph',
        helper: 'Render a sparkline behind each fuel grade using HA history.',
        selector: { boolean: {} },
      },
      {
        name: 'trend_hours',
        label: 'Trend Hours',
        helper: 'Hours of price history to display. Default 168 (7 days). Range 1–720.',
        selector: { number: { min: 1, max: 720, mode: 'box' } },
      },
    ],
  },

  // ── Fuel sensor overrides ────────────────────────────────
  {
    type: 'expandable',
    name: '_fuel_overrides_section',
    title: 'Fuel Sensor Overrides',
    icon: 'mdi:fuel',
    schema: [
      sensorOverride('regular_gas', 'Regular Gas'),
      sensorOverride('midgrade_gas', 'Midgrade Gas'),
      sensorOverride('premium_gas', 'Premium Gas'),
      sensorOverride('diesel', 'Diesel'),
      sensorOverride('regular_gas_cash', 'Regular Gas (Cash)'),
      sensorOverride('midgrade_gas_cash', 'Midgrade Gas (Cash)'),
      sensorOverride('premium_gas_cash', 'Premium Gas (Cash)'),
      sensorOverride('diesel_cash', 'Diesel (Cash)'),
      sensorOverride('e85', 'E85'),
      sensorOverride('e85_cash', 'E85 (Cash)'),
      sensorOverride('e15', 'E15 / UNL88'),
      sensorOverride('e15_cash', 'E15 / UNL88 (Cash)'),
      sensorOverride('last_updated', 'Last Updated'),
    ],
  },

  // ── EV charger overrides ─────────────────────────────────
  {
    type: 'expandable',
    name: '_ev_chargers_section',
    title: 'EV Charger Overrides',
    icon: 'mdi:ev-station',
    schema: [
      sensorOverride('ev_level1', 'Level 1 Chargers'),
      sensorOverride('ev_level2', 'Level 2 Chargers'),
      sensorOverride('ev_dc_fast', 'DC Fast Chargers'),
    ],
  },

  // ── EV connector overrides ───────────────────────────────
  {
    type: 'expandable',
    name: '_ev_connectors_section',
    title: 'EV Connector Overrides',
    icon: 'mdi:power-plug',
    schema: [
      sensorOverride('ev_j1772', 'J1772 Connectors'),
      sensorOverride('ev_j1772_power', 'J1772 Connector Power'),
      sensorOverride('ev_ccs', 'CCS Connectors'),
      sensorOverride('ev_ccs_power', 'CCS Connector Power'),
      sensorOverride('ev_chademo', 'CHAdeMO Connectors'),
      sensorOverride('ev_chademo_power', 'CHAdeMO Connector Power'),
      sensorOverride('ev_nacs', 'NACS Connectors'),
      sensorOverride('ev_nacs_power', 'NACS Connector Power'),
    ],
  },

  // ── EV metadata overrides ────────────────────────────────
  {
    type: 'expandable',
    name: '_ev_metadata_section',
    title: 'EV Metadata Overrides',
    icon: 'mdi:information-outline',
    schema: [
      sensorOverride('ev_network', 'Charging Network'),
      sensorOverride('ev_pricing', 'Pricing'),
      sensorOverride('ev_access_hours', 'Access Hours'),
      sensorOverride('ev_status', 'Station Status'),
      sensorOverride('ev_cards_accepted', 'Accepted Payment Methods'),
      sensorOverride('ev_date_last_confirmed', 'Date Last Confirmed'),
    ],
  },
];

// Form fields whose names start with `_` are pure presentation markers
// for ha-form's expandable sections. Strip them out of the value before
// emitting config-changed so they never end up persisted in the YAML.
const PRESENTATION_KEY = /^_/;

function stripPresentationKeys(value: GasBuddyCardConfig): GasBuddyCardConfig {
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (!PRESENTATION_KEY.test(k)) cleaned[k] = v;
  }
  return cleaned as unknown as GasBuddyCardConfig;
}

@customElement('gasbuddy-card-editor')
export class GasBuddyCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: GasBuddyCardConfig;

  public setConfig(config: GasBuddyCardConfig): void {
    this._config = config;
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: HaFormSchemaEntry) => {
          if ('title' in s) return s.title;
          return s.label || s.name;
        }}
        .computeHelper=${(s: HaFormSchemaEntry) =>
          'helper' in s ? s.helper || '' : ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent<{ value: GasBuddyCardConfig }>): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: stripPresentationKeys(ev.detail.value) },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
