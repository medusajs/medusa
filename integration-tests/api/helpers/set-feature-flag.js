const {
  default: FeatureFlagStrategy,
} = require("../src/strategies/feature-flag")

module.exports = (featureFlags) => {
  FeatureFlagStrategy.setFlags(featureFlags)
}
