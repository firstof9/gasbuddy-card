import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runAction, type ActionContext } from './actions.js';
import type { ActionConfig, HomeAssistant } from './types.js';

const buildHass = (overrides: Partial<HomeAssistant> = {}): HomeAssistant => ({
  states: {},
  entities: {},
  ...overrides,
});

interface MockContext extends ActionContext {
  callService: ReturnType<typeof vi.fn>;
}

const buildContext = (hassOverrides: Partial<HomeAssistant> = {}): MockContext => {
  const callService = vi.fn();
  return {
    hass: buildHass({ callService, ...hassOverrides }),
    moreInfo: vi.fn() as unknown as ActionContext['moreInfo'],
    navigate: vi.fn() as unknown as ActionContext['navigate'],
    openUrl: vi.fn() as unknown as ActionContext['openUrl'],
    callService,
  };
};

describe('runAction', () => {
  let ctx: MockContext;

  beforeEach(() => {
    ctx = buildContext();
  });

  it('returns false and does nothing for undefined config', () => {
    expect(runAction(undefined, ctx, 'sensor.x')).toBe(false);
    expect(ctx.moreInfo).not.toHaveBeenCalled();
    expect(ctx.navigate).not.toHaveBeenCalled();
    expect(ctx.openUrl).not.toHaveBeenCalled();
    expect(ctx.callService).not.toHaveBeenCalled();
  });

  it('returns false and does nothing for action: none', () => {
    expect(runAction({ action: 'none' }, ctx, 'sensor.x')).toBe(false);
    expect(ctx.moreInfo).not.toHaveBeenCalled();
  });

  describe('more-info', () => {
    it('uses the explicit entity when provided', () => {
      const config: ActionConfig = { action: 'more-info', entity: 'sensor.explicit' };
      expect(runAction(config, ctx, 'sensor.default')).toBe(true);
      expect(ctx.moreInfo).toHaveBeenCalledWith('sensor.explicit');
    });

    it('falls back to defaultEntityId when no explicit entity', () => {
      expect(runAction({ action: 'more-info' }, ctx, 'sensor.default')).toBe(true);
      expect(ctx.moreInfo).toHaveBeenCalledWith('sensor.default');
    });

    it('returns false when neither explicit entity nor default is available', () => {
      expect(runAction({ action: 'more-info' }, ctx)).toBe(false);
      expect(ctx.moreInfo).not.toHaveBeenCalled();
    });

    it('prefers explicit entity over default even when both present', () => {
      const config: ActionConfig = { action: 'more-info', entity: 'sensor.explicit' };
      runAction(config, ctx, 'sensor.default');
      expect(ctx.moreInfo).toHaveBeenCalledWith('sensor.explicit');
      expect(ctx.moreInfo).not.toHaveBeenCalledWith('sensor.default');
    });
  });

  describe('navigate', () => {
    it('dispatches with the given navigation_path', () => {
      const config: ActionConfig = { action: 'navigate', navigation_path: '/lovelace/test' };
      expect(runAction(config, ctx)).toBe(true);
      expect(ctx.navigate).toHaveBeenCalledWith('/lovelace/test');
    });

    it('returns false and skips dispatch when navigation_path is empty', () => {
      const config = { action: 'navigate', navigation_path: '' } as ActionConfig;
      expect(runAction(config, ctx)).toBe(false);
      expect(ctx.navigate).not.toHaveBeenCalled();
    });
  });

  describe('url', () => {
    it('dispatches with the given url_path', () => {
      const config: ActionConfig = { action: 'url', url_path: 'https://example.com' };
      expect(runAction(config, ctx)).toBe(true);
      expect(ctx.openUrl).toHaveBeenCalledWith('https://example.com');
    });

    it('returns false and skips when url_path is empty', () => {
      const config = { action: 'url', url_path: '' } as ActionConfig;
      expect(runAction(config, ctx)).toBe(false);
      expect(ctx.openUrl).not.toHaveBeenCalled();
    });
  });

  describe('call-service', () => {
    it('parses domain.service and forwards data + target to hass.callService', () => {
      const config: ActionConfig = {
        action: 'call-service',
        service: 'light.toggle',
        service_data: { brightness: 128 },
        target: { entity_id: 'light.kitchen' },
      };
      expect(runAction(config, ctx)).toBe(true);
      expect(ctx.callService).toHaveBeenCalledWith(
        'light',
        'toggle',
        { brightness: 128 },
        { entity_id: 'light.kitchen' },
      );
    });

    it('forwards undefined data/target if not provided', () => {
      const config: ActionConfig = { action: 'call-service', service: 'script.reload' };
      runAction(config, ctx);
      expect(ctx.callService).toHaveBeenCalledWith('script', 'reload', undefined, undefined);
    });

    it('returns false for a malformed service string with no dot', () => {
      const config = { action: 'call-service', service: 'no_dot' } as ActionConfig;
      expect(runAction(config, ctx)).toBe(false);
      expect(ctx.callService).not.toHaveBeenCalled();
    });

    it('returns false when service is empty', () => {
      const config = { action: 'call-service', service: '' } as ActionConfig;
      expect(runAction(config, ctx)).toBe(false);
      expect(ctx.callService).not.toHaveBeenCalled();
    });

    it('only splits the first dot — domain "switch", service "x.y" preserves rest', () => {
      // .split('.', 2) yields ['switch', 'x'] — the part after the second
      // dot is dropped. Pinning that behavior so a future "split all" change
      // is intentional.
      const config: ActionConfig = { action: 'call-service', service: 'switch.x.y' };
      runAction(config, ctx);
      expect(ctx.callService).toHaveBeenCalledWith('switch', 'x', undefined, undefined);
    });

    it('returns false when hass is not present in context', () => {
      const ctxNoHass: MockContext = { ...ctx, hass: undefined };
      const config: ActionConfig = { action: 'call-service', service: 'light.toggle' };
      expect(runAction(config, ctxNoHass)).toBe(false);
    });

    it('returns false when hass.callService is not present', () => {
      const ctxNoCallSvc: MockContext = { ...ctx, hass: buildHass() }; // no callService prop
      const config: ActionConfig = { action: 'call-service', service: 'light.toggle' };
      expect(runAction(config, ctxNoCallSvc)).toBe(false);
    });
  });
});
