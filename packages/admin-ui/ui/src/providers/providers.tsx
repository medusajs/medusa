import { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import RouteRegistry from "../registries/route-registry"
import SettingRegistry from "../registries/setting-registry"
import WidgetRegistry from "../registries/widget-registry"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"
import { PollingProvider } from "./polling-provider"
import { RouteProvider } from "./route-provider"
import { SettingProvider } from "./setting-provider"
import { WidgetProvider } from "./widget-provider"
import { ImportRefresh } from "./import-refresh"

type Props = PropsWithChildren<{
  widgetRegistry: WidgetRegistry
  routeRegistry: RouteRegistry
  settingRegistry: SettingRegistry
}>

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({
  widgetRegistry,
  routeRegistry,
  settingRegistry,
  children,
}: Props) => {
  return (
    <HelmetProvider>
      <MedusaProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <ImportRefresh>
              <SteppedProvider>
                <LayeredModalProvider>
                  <WidgetProvider registry={widgetRegistry}>
                    <RouteProvider registry={routeRegistry}>
                      <SettingProvider registry={settingRegistry}>
                        {children}
                      </SettingProvider>
                    </RouteProvider>
                  </WidgetProvider>
                </LayeredModalProvider>
              </SteppedProvider>
            </ImportRefresh>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  )
}
