import { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import RouteRegistry from "../registries/route-registry"
import WidgetRegistry from "../registries/widget-registry"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"
import { PollingProvider } from "./polling-provider"
import { RouteProvider } from "./route-provider"
import { WidgetProvider } from "./widget-provider"

type Props = PropsWithChildren<{
  widgetRegistry: WidgetRegistry
  routeRegistry: RouteRegistry
}>

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({
  widgetRegistry,
  routeRegistry,
  children,
}: Props) => {
  return (
    <HelmetProvider>
      <MedusaProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <SteppedProvider>
              <LayeredModalProvider>
                <WidgetProvider registry={widgetRegistry}>
                  <RouteProvider registry={routeRegistry}>
                    {children}
                  </RouteProvider>
                </WidgetProvider>
              </LayeredModalProvider>
            </SteppedProvider>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  )
}
