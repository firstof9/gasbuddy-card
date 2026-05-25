import type { ActionConfig, HomeAssistant } from './types.js';

/**
 * Side-effect surface used by `runAction`. The card constructs a real
 * one from window + hass; tests pass mocks. Keeping the dispatcher
 * pure (no direct window/hass coupling) makes it trivial to verify in
 * unit tests without a DOM.
 */
export interface ActionContext {
  hass?: HomeAssistant;
  /** Open the more-info dialog for an entity (dispatched as a CustomEvent). */
  moreInfo: (entityId: string) => void;
  /** Navigate the lovelace router to a path. */
  navigate: (path: string) => void;
  /** Open an external URL in a new tab. */
  openUrl: (url: string) => void;
}

/**
 * Dispatches a Home Assistant ActionConfig against the standard
 * lovelace events / window APIs. Pure: only touches `ctx`. Returns
 * `true` if the action was actually dispatched (useful for tests +
 * tracking activations), `false` for no-ops (missing config, missing
 * entity, malformed service, action: 'none').
 */
export function runAction(
  config: ActionConfig | undefined,
  ctx: ActionContext,
  defaultEntityId?: string,
): boolean {
  if (!config) return false;
  switch (config.action) {
    case 'none':
      return false;
    case 'more-info': {
      const entityId = config.entity || defaultEntityId;
      if (!entityId) return false;
      ctx.moreInfo(entityId);
      return true;
    }
    case 'navigate':
      if (!config.navigation_path) return false;
      ctx.navigate(config.navigation_path);
      return true;
    case 'url':
      if (!config.url_path) return false;
      ctx.openUrl(config.url_path);
      return true;
    case 'call-service': {
      if (!config.service || !config.service.includes('.')) return false;
      const [domain, service] = config.service.split('.', 2);
      if (!ctx.hass?.callService) return false;
      ctx.hass.callService(domain, service, config.service_data, config.target);
      return true;
    }
  }
}
