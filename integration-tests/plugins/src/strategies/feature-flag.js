import { AbstractFeatureFlagStrategy } from "@medusajs/medusa"

class FeatureFlagStrategy extends AbstractFeatureFlagStrategy {
  static features = Map()

  isSet(flagname) {
    return !!(
      FeatureFlagStrategy.features.has(flagname) &&
      FeatureFlagStrategy.features.get(flagname)
    )
  }
}

export default FeatureFlagStrategy
