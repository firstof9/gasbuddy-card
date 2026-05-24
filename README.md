# GasBuddy Lovelace Card

A premium, modern Home Assistant Lovelace custom card for displaying gas prices and EV charging station data fetched by the [GasBuddy integration](https://github.com/firstof9/ha-gasbuddy).

The card features automatic entity discovery based on a chosen GasBuddy station device and displays both fuel prices and charging details in a responsive, visually appealing grid layout.

## Features

- **Automatic Entity Discovery:** Select a GasBuddy station device in the Lovelace card editor, and the card will automatically find and configure all related sensors.
- **Hybrid View:** Seamlessly toggle between **Gas Prices** and **EV Chargers** at stations that offer both services. If only one service is configured or available, the tab bar hides and displays only the active service.
- **Vibrant Fuel Grid:** Displays Regular, Midgrade, Premium, Diesel, UNL88, and E85. Shows cash vs credit prices side-by-side on each card where available.
- **Detailed EV Panel:** Shows charger counts (Level 1, Level 2, DC Fast), connector counts/power ratings (J1772, CCS, CHAdeMO, NACS), pricing, network name, access hours, accepted payments, and last confirmed timestamp.
- **Custom Brand Mappings:** Renders custom inline brand SVGs for major charging networks (Tesla, ChargePoint, EVgo, Electrify America, FLO, Blink, Shell Recharge) and brand logos for fuel brands where configured.
- **Manual Overrides:** Allows explicit override of individual sensors in the card editor if needed.

## Installation

### Via HACS (Home Assistant Community Store)

1. Open HACS in your Home Assistant instance.
2. Click the three dots in the top-right corner and select **Custom repositories**.
3. Paste the URL of this repository: `https://github.com/firstof9/gasbuddy-card`
4. Set the category to **Lovelace** and click **Add**.
5. Find the **GasBuddy Card** in the HACS interface, click **Download**, and restart your frontend if prompted.

### Manual Installation

1. Build the card locally or download `gasbuddy-card.js` from the latest release.
2. Copy `gasbuddy-card.js` into your `<config-dir>/www/` directory.
3. Add a reference to the card in your Lovelace resources (Settings -> Dashboards -> Resources):
   - **URL:** `/local/gasbuddy-card.js`
   - **Type:** `JavaScript Module`

## Configuration

### Lovelace UI (Visual Editor)

This card comes with a full interactive configuration editor. Add the card to your dashboard, and use the UI to select your GasBuddy station device and manage overrides.

### YAML Configuration

```yaml
type: custom:gasbuddy-card
device_id: 32_character_device_registry_id_from_hacs_gasbuddy
title: "My Local Shell"       # Optional card title
default_mode: gas             # Optional default tab ('gas' or 'ev')
```

#### Sensor Overrides (Optional)

If you wish to manually override individual sensors:

```yaml
type: custom:gasbuddy-card
device_id: 32_character_device_registry_id
regular_gas_entity: sensor.other_regular_gas_sensor
premium_gas_entity: sensor.other_premium_gas_sensor
ev_dc_fast_entity: sensor.other_ev_dc_fast_chargers
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
