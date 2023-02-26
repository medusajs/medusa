import { PropsWithChildren } from "react"
import { LayeredModalProvider, SteppedProvider } from "../components/organisms"
import { FeatureFlagProvider } from "./feature-flag-provider"
import { MedusaProvider } from "./medusa-provider"

/**
 * This component wraps all providers into a single component.
 */
const KitchenSink = ({ children }: PropsWithChildren) => {
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

export default KitchenSink
