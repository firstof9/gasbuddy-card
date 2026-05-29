import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    transition: all 0.3s ease;
  }

  .card-message {
    padding: 16px;
  }

  .card-message--error {
    color: var(--error-color, red);
  }

  .card-message--info {
    color: var(--secondary-text-color);
  }

  .network-name {
    color: var(--gasbuddy-network-color, var(--primary-color));
    font-weight: 600;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .header-text {
    flex-grow: 1;
    min-width: 0;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
  }

  .subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 6px;
    line-height: 1.4;
  }

  .title-link {
    color: inherit;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .title-link:hover,
  .title-link:focus-visible {
    color: var(--primary-color);
    text-decoration: underline;
  }

  .title-link-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .title-link:hover .title-link-icon,
  .title-link:focus-visible .title-link-icon {
    opacity: 1;
  }

  .brand-logo {
    height: 40px;
    width: auto;
    min-width: 40px;
    max-width: 80px;
    border-radius: 6px;
    background: var(--gasbuddy-brand-logo-bg, white);
    box-shadow: var(--gasbuddy-brand-logo-shadow, var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1)));
    border: 1px solid var(--gasbuddy-brand-logo-border, transparent);
    margin-left: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0 4px;
  }

  .brand-logo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .brand-logo ha-icon {
    --mdc-icon-size: 28px;
    color: var(--primary-color);
  }

  /* When the brand slot holds an EV network logo (SVG or pill), drop the
     white "card" framing — the brand color carries the visual itself. */
  .brand-logo.brand-network {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    min-width: 0;
    max-width: none;
    overflow: visible;
  }

  .network-svg {
    width: 32px;
    height: 32px;
    display: block;
  }

  .network-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #fff;
    white-space: nowrap;
    line-height: 1;
  }

  /* When the brand slot is just a generic icon (no station-brand image),
     drop the white card framing — it clashes in dark themes. */
  .brand-logo--icon {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    min-width: 0;
    padding: 0;
  }

  /* Mode Switcher Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-bottom: 16px;
    gap: 8px;
  }

  .tab {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color);
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .tab:hover {
    color: var(--primary-text-color);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }

  /* Gas Price Grid Layout */
  .gas-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .price-card {
    background: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.05)));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    border-top: 3px solid var(--gasbuddy-brand-color, var(--accent-color));
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 12px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .price-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow, 0 4px 8px rgba(0,0,0,0.1));
  }

  .price-card--interactive {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
  }

  .price-card--interactive:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .price-card-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .price-card-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    height: 100%;
  }

  .trend-svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
    mask-image: linear-gradient(180deg, transparent 0%, #000 70%);
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 70%);
  }

  /* Min/max markers on the trend background. Same theme tokens as the
     trend-indicator chip so colors stay consistent across the card. */
  .trend-extreme--min {
    fill: var(--success-color, #43a047);
  }

  .trend-extreme--max {
    fill: var(--error-color, #db4437);
  }

  .trend-hover-guide {
    stroke: var(--accent-color);
    stroke-width: 0.5;
    stroke-dasharray: 1.5 1;
    opacity: 0.75;
  }

  .trend-hover-dot {
    fill: var(--accent-color);
    stroke: var(--card-background-color, var(--ha-card-background, #fff));
    stroke-width: 0.6;
  }

  /* Hover tooltip is rendered as a sibling of the trend SVG inside the
     price-card. translateX(-50%) centers the tooltip on the inline-set
     left percentage. pointer-events: none keeps the more-info click and
     the hover detection on the parent card uninterrupted. */
  .trend-tooltip {
    position: absolute;
    top: 4px;
    transform: translateX(-50%);
    background: var(--ha-card-background, var(--card-background-color, #222));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 6px;
    padding: 2px 6px;
    font-size: 10px;
    line-height: 1.2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    z-index: 2;
    pointer-events: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    white-space: nowrap;
  }

  .trend-tooltip-price {
    font-weight: 700;
  }

  .trend-tooltip-time {
    color: var(--secondary-text-color);
    font-size: 9px;
  }

  .fuel-type {
    font-size: 10px;
    font-weight: 600;
    color: var(--primary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(128, 128, 128, 0.18);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(128, 128, 128, 0.22);
    line-height: 1.2;
  }

  .fuel-price {
    font-size: 34px;
    font-weight: 600;
    color: var(--primary-text-color);
    letter-spacing: -1px;
    line-height: 1;
    text-align: center;
    margin: 6px 0 4px;
    display: block;
  }

  .dual-prices {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
  }

  .price-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .price-col .fuel-price {
    font-size: 20px;
    margin: 2px 0;
  }

  .deal-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--rgb-success-color, 76, 175, 80), 0.15);
    color: var(--success-color, #4caf50);
    border: 1px solid rgba(var(--rgb-success-color, 76, 175, 80), 0.3);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    margin: 4px auto 0 auto;
    width: fit-content;
    line-height: 1.2;
    z-index: 1;
  }

  .price-label {
    font-size: 9px;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    font-weight: 500;
    margin-top: 2px;
  }

  .price-meta {
    position: relative;
    z-index: 1;
    font-size: 9px;
    text-align: center;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .trend-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    padding: 2px 6px;
    border-radius: 12px;
    background: rgba(128, 128, 128, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .trend-indicator-icon {
    --mdc-icon-size: 12px;
    color: inherit;
  }

  /* Falling prices are good for the driver — use the theme's success hue.
     Rising prices use the error hue. Flat uses the neutral secondary text
     color set on .trend-indicator above. */
  .trend-indicator--down {
    background: var(--gasbuddy-trend-down-bg, rgba(46, 125, 50, 0.9));
    color: var(--gasbuddy-trend-down-color, #ffffff);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .trend-indicator--up {
    background: var(--gasbuddy-trend-up-bg, rgba(183, 28, 28, 0.9));
    color: var(--gasbuddy-trend-up-color, #ffffff);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* EV Section Layout */
  .ev-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .charger-summary {
    display: flex;
    gap: 12px;
  }

  .charger-badge {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-top: 3px solid var(--gasbuddy-brand-color, var(--accent-color));
    border-radius: 12px;
    padding: 12px;
  }

  .charger-badge ha-icon {
    --mdc-icon-size: 32px;
    color: var(--primary-color);
  }

  .charger-badge.fast ha-icon {
    color: #ff9800;
  }

  .charger-info {
    display: flex;
    flex-direction: column;
  }

  .charger-count {
    font-size: 20px;
    font-weight: 700;
  }

  .charger-label {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  /* Connector Grid */
  .connector-section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .connectors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
  }

  .connector-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.05);
    border: 1px solid rgba(var(--rgb-primary-color, 33, 150, 243), 0.15);
    border-radius: 8px;
    padding: 8px 12px;
  }

  .connector-name {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .connector-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .connector-count {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-color);
  }

  .connector-power {
    font-size: 10px;
    color: var(--secondary-text-color);
    letter-spacing: 0.2px;
  }

  /* EV Metadata List */
  .metadata-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-top: 12px;
  }

  .metadata-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    line-height: 1.4;
  }

  .metadata-key {
    color: var(--secondary-text-color);
    font-weight: 500;
  }

  .metadata-val {
    color: var(--primary-text-color);
    text-align: right;
    max-width: 60%;
    word-break: break-word;
  }

  .metadata-val a {
    color: inherit;
    text-decoration: none;
  }

  .metadata-val a:hover {
    text-decoration: underline;
  }

  /* Footer Section */
  .footer {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .attribution {
    font-style: italic;
  }

  .last-updated {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .last-updated-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: transparent;
    line-height: 1.2;
  }

  .last-updated-chip ha-icon {
    --mdc-icon-size: 12px;
  }

  /* Payment Card Badges */
  .payment-icons-container {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .payment-card-icon {
    width: 45px;
    height: 30px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    display: inline-block;
    vertical-align: middle;
  }

  /* Mobile Responsive overrides */
  @media (max-width: 360px) {
    .charger-summary {
      flex-direction: column;
    }
    .gas-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-color-scheme: dark) {
    .brand-logo:not(.brand-logo--icon):not(.brand-network) {
      --gasbuddy-brand-logo-bg: transparent;
      --gasbuddy-brand-logo-shadow: none;
      --gasbuddy-brand-logo-border: var(--divider-color, rgba(255, 255, 255, 0.12));
    }
  }
`;
