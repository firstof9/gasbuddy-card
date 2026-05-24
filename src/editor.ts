import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { GasBuddyCardConfig, HomeAssistant } from './types.js';

interface HaFormSchemaEntry {
  name: string;
  label: string;
  helper?: string;
  selector: Record<string, unknown>;
}

const SCHEMA: HaFormSchemaEntry[] = [
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
    helper: 'Which tab to show by default when the card loads.',
    selector: {
      select: {
        options: [
          { value: 'gas', label: 'Gas Prices' },
          { value: 'ev', label: 'EV Chargers' },
        ],
      },
    },
  },
  // Overrides section
  {
    name: 'regular_gas_entity',
    label: 'Regular Gas Sensor Override',
    selector: { entity: { domain: 'sensor' } },
  },
  {
    name: 'premium_gas_entity',
    label: 'Premium Gas Sensor Override',
    selector: { entity: { domain: 'sensor' } },
  },
  {
    name: 'diesel_entity',
    label: 'Diesel Sensor Override',
    selector: { entity: { domain: 'sensor' } },
  },
  {
    name: 'ev_dc_fast_entity',
    label: 'EV DC Fast Chargers Override',
    selector: { entity: { domain: 'sensor' } },
  },
  {
    name: 'ev_level2_entity',
    label: 'EV Level 2 Chargers Override',
    selector: { entity: { domain: 'sensor' } },
  },
];

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
        .computeLabel=${(s: HaFormSchemaEntry) => s.label || s.name}
        .computeHelper=${(s: HaFormSchemaEntry) => s.helper || ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent<{ value: GasBuddyCardConfig }>): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: ev.detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
