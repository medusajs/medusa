import { PageRegistry, WidgetRegistry } from "@medusajs/admin-shared"
import { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"
import { PageProvider } from "./page-provider"
import { PollingProvider } from "./polling-provider"
import { WidgetProvider } from "./widget-provider"

type Props = PropsWithChildren<{
  widgetRegistry: WidgetRegistry
  pageRegistry: PageRegistry
}>

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({
  widgetRegistry,
  pageRegistry,
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
                  <PageProvider registry={pageRegistry}>
                    {children}
                  </PageProvider>
                </WidgetProvider>
              </LayeredModalProvider>
            </SteppedProvider>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  )
}
