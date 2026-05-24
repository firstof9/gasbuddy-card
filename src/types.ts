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
  connection?: {
    sendMessagePromise: (msg: Record<string, unknown>) => Promise<unknown>;
  };
}

export interface GasBuddyCardConfig {
  type: string;
  device_id?: string;
  title?: string;
  default_mode?: 'gas' | 'ev';
  
  // Overrides for specific sensors
  regular_gas_entity?: string;
  midgrade_gas_entity?: string;
  premium_gas_entity?: string;
  diesel_entity?: string;
  regular_gas_cash_entity?: string;
  midgrade_gas_cash_entity?: string;
  premium_gas_cash_entity?: string;
  diesel_cash_entity?: string;
  e85_entity?: string;
  e85_cash_entity?: string;
  e15_entity?: string;
  e15_cash_entity?: string;
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
