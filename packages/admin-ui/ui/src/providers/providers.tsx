import { PropsWithChildren } from "react"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"
import { PollingProvider } from "./polling-provider"

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <MedusaProvider>
      <FeatureFlagProvider>
        <PollingProvider>
          <SteppedProvider>
            <LayeredModalProvider>{children}</LayeredModalProvider>
          </SteppedProvider>
        </PollingProvider>
      </FeatureFlagProvider>
    </MedusaProvider>
  )
}
