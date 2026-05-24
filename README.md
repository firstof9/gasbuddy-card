# GasBuddy Card

[![GitHub Release](https://img.shields.io/github/v/release/firstof9/gasbuddy-card?style=for-the-badge)](https://github.com/firstof9/gasbuddy-card/releases)
[![GitHub Downloads](https://img.shields.io/github/downloads/firstof9/gasbuddy-card/total?style=for-the-badge)](https://github.com/firstof9/gasbuddy-card/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/firstof9/gasbuddy-card/lint.yml?branch=main&label=CI&style=for-the-badge)](https://github.com/firstof9/gasbuddy-card/actions/workflows/lint.yml)
[![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/firstof9/gasbuddy-card?style=for-the-badge)](https://github.com/firstof9/gasbuddy-card/blob/main/LICENSE)

A modern, premium Home Assistant custom Lovelace card for displaying gas prices and EV charging station data fetched from the [GasBuddy custom integration](https://github.com/firstof9/ha-gasbuddy).

## Screenshots

### Gas Prices View
![Gas Prices State](screenshots/gas_station.png)

### EV Chargers View
![EV Chargers State](screenshots/ev_only_station.png)

### Visual Configuration
![Configuration Editor](screenshots/card_editor.png)

## Requirements

This card requires the **[GasBuddy custom integration](https://github.com/firstof9/ha-gasbuddy)** to be installed and configured in Home Assistant.

## Installation

### HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=firstof9&repository=gasbuddy-card&category=plugin)

1. Open HACS.
2. Click on "Frontend".
3. Click on the three dots in the top right corner and select "Custom repositories".
4. Add `https://github.com/firstof9/gasbuddy-card` with category "Lovelace".
5. Search for "GasBuddy Card" and click "Download".

### Manual

1. Download `gasbuddy-card.js` from the latest release (it's a single self-contained bundle).
2. Copy it to your `config/www/` directory.
3. Add the following to your `configuration.yaml` or through the UI:
   ```yaml
   resources:
     - url: /local/gasbuddy-card.js
       type: module
   ```

## Usage

The card uses your GasBuddy device ID (from the integration device registry) to automatically discover and display the station name, coordinates, fuel prices, and EV charger states.

```yaml
type: custom:gasbuddy-card
device_id: 32_character_device_registry_id_from_hacs_gasbuddy
default_mode: gas             # Optional: 'gas' or 'ev' (defaults to 'gas')
title: "My Local Station"     # Optional: Custom card title override
```

## Advanced configuration

If you need to override individual sensors discovered automatically by the device ID, you can supply their entity IDs explicitly:

```yaml
type: custom:gasbuddy-card
device_id: 32_character_device_registry_id
regular_gas_entity: sensor.other_regular_gas_sensor
premium_gas_entity: sensor.other_premium_gas_sensor
ev_dc_fast_entity: sensor.other_ev_dc_fast_chargers
```

### Full Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | string | **Required** | Must be `custom:gasbuddy-card`. |
| `device_id` | string | **Required** | The device registry ID of the GasBuddy station. |
| `title` | string | Optional | Custom title header of the card. |
| `default_mode` | string | `gas` | Default active tab to display. Options: `gas`, `ev`. |
| `[fuel_type]_entity` | string | Auto-discovered | Manual override for specific fuel price sensors. |
| `[ev_sensor]_entity` | string | Auto-discovered | Manual override for specific EV charger status/connector sensors. |

## Development

The card is written in TypeScript with [Lit](https://lit.dev) and bundled with [Rollup](https://rollupjs.org). Source lives in `src/`; the committed `gasbuddy-card.js` at the repo root is the bundled output.

```bash
npm install        # install dev deps + lit
npm run typecheck  # tsc --noEmit (no JS emit, just type checking)
npm test           # run placeholder test script
npm run build      # produce gasbuddy-card.js from src/
npm run build:watch  # rebuild on every save while iterating
```

CI runs `typecheck`, `build`, and `test` on every PR. The `build` job also fails CI if the committed bundle is out of sync with source.
