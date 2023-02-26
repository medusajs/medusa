import { PropsWithChildren } from "react"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"

/**
 * This component wraps all providers into a single component.
 */
export const KitchenSink = ({ children }: PropsWithChildren) => {
  return (
    <MedusaProvider>
      <FeatureFlagProvider>
        <SteppedProvider>
          <LayeredModalProvider>{children}</LayeredModalProvider>
        </SteppedProvider>
      </FeatureFlagProvider>
    </MedusaProvider>
  )
}
