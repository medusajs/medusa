import { RouteConfig, WidgetConfig } from "./types"

function createConfigHelper<TConfig extends Record<string, unknown>>(
  config: TConfig
): TConfig {
  return {
    ...config,
    /**
     * This property is required to allow the config to be exported,
     * while still allowing HMR to work correctly.
     *
     * It tricks Fast Refresh into thinking that the config is a React component,
     * which allows it to be updated without a full page reload.
     */
    $$typeof: Symbol.for("react.memo"),
  }
}

/**
 * Define a widget configuration.
 *
 * @param config The widget configuration.
 * @returns The widget configuration.
 */
export function defineWidgetConfig(config: WidgetConfig) {
  return createConfigHelper(config)
}

/**
 * Define a route configuration.
 *
 * @param config The route configuration.
 * @returns The route configuration.
 */
export function defineRouteConfig(config: RouteConfig) {
  return createConfigHelper(config)
}
