import { InjectionZones } from "@medusajs/types"
import { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { InjectionZoneProvider } from "./injection-zone-provider"
import { MedusaProvider } from "./medusa-provider"
import { PollingProvider } from "./polling-provider"

type Props = PropsWithChildren<{
  injectionZones: InjectionZones
}>

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({ injectionZones, children }: Props) => {
  return (
    <HelmetProvider>
      <MedusaProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <SteppedProvider>
              <LayeredModalProvider>
                <InjectionZoneProvider injectionZoneMap={injectionZones}>
                  {children}
                </InjectionZoneProvider>
              </LayeredModalProvider>
            </SteppedProvider>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  )
}
