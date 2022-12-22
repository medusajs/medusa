import React from "react"
import { FeatureFlagContext } from "../../context/feature-flag"

export type FeatureToggleProps = {
  featureFlag: string
  showOnlyWhenDisabled?: boolean
  children?: React.ReactNode
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({
  featureFlag,
  showOnlyWhenDisabled = false,
  children,
}) => {
  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)

  const showContent = isFeatureEnabled(featureFlag) === !showOnlyWhenDisabled
  return showContent ? <>{children}</> : null
}

export default FeatureToggle
