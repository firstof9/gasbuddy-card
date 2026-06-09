export interface HassEntityState {
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    attribution?: string;
    latitude?: number;
    longitude?: number;
    [key: string]: unknown;
  };
}

export interface HomeAssistantEntity {
  entity_id: string;
  device_id?: string;
  area_id?: string;
  name?: string;
  icon?: string;
  platform?: string;
  [key: string]: unknown;
}

export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  entities?: Record<string, HomeAssistantEntity>;
  locale?: { language?: string };
  language?: string;
  config?: {
    unit_system?: {
      length?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  localize?: (key: string, ...args: unknown[]) => string;
  connection?: {
    sendMessagePromise: (msg: Record<string, unknown>) => Promise<unknown>;
  };
  callService?: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => void;
}

// HA-standard ActionConfig — what the lovelace action picker emits and
// what most built-in cards consume for tap_action / hold_action.
export type ActionConfig =
  | { action: 'none' }
  | { action: 'more-info'; entity?: string }
  | { action: 'navigate'; navigation_path: string }
  | { action: 'url'; url_path: string }
  | {
      action: 'call-service';
      service: string;
      service_data?: Record<string, unknown>;
      target?: Record<string, unknown>;
    };

export interface GasBuddyCardConfig {
  type: string;
  device_id?: string;
  title?: string;
  default_mode?: 'gas' | 'ev';
  compact?: boolean;
  show_trend?: boolean;
  trend_hours?: number;
  show_trend_indicator?: boolean;
  trend_indicator_baseline_hours?: number;
  show_fuel_types?: string[];

  // Configurable tap / hold actions on each price tile. Default tap_action
  // is `{ action: 'more-info' }` for the tile's primary sensor; default
  // hold_action is `{ action: 'none' }`.
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;

  // Overrides for specific sensors
  regular_gas_entity?: string;
  midgrade_gas_entity?: string;
  premium_gas_entity?: string;
  diesel_entity?: string;
  regular_gas_cash_entity?: string;
  midgrade_gas_cash_entity?: string;
  premium_gas_cash_entity?: string;
  diesel_cash_entity?: string;
  regular_gas_deal_entity?: string;
  midgrade_gas_deal_entity?: string;
  premium_gas_deal_entity?: string;
  diesel_deal_entity?: string;
  e85_entity?: string;
  e85_cash_entity?: string;
  e85_deal_entity?: string;
  e15_entity?: string;
  e15_cash_entity?: string;
  e15_deal_entity?: string;
  last_updated_entity?: string;

  // EV charging overrides
  ev_level1_entity?: string;
  ev_level2_entity?: string;
  ev_dc_fast_entity?: string;
  ev_j1772_entity?: string;
  ev_j1772_power_entity?: string;
  ev_ccs_entity?: string;
  ev_ccs_power_entity?: string;
  ev_chademo_entity?: string;
  ev_chademo_power_entity?: string;
  ev_nacs_entity?: string;
  ev_nacs_power_entity?: string;
  ev_network_entity?: string;
  ev_pricing_entity?: string;
  ev_access_hours_entity?: string;
  ev_status_entity?: string;
  ev_cards_accepted_entity?: string;
  ev_date_last_confirmed_entity?: string;
}
