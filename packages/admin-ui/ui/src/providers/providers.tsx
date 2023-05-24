import { PageRegistry, WidgetRegistry } from "@medusajs/admin-shared"
import { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { WidgetProvider } from "./injection-zone-provider"
import { MedusaProvider } from "./medusa-provider"
import { PollingProvider } from "./polling-provider"

type Props = PropsWithChildren<{
  widgetRegistry: WidgetRegistry
  pageRegistry: PageRegistry
}>

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({ widgetRegistry, children }: Props) => {
  return (
    <HelmetProvider>
      <MedusaProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <SteppedProvider>
              <LayeredModalProvider>
                <WidgetProvider registry={widgetRegistry}>
                  {children}
                </WidgetProvider>
              </LayeredModalProvider>
            </SteppedProvider>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  )
}
