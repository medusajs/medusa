import React from "react"
import { useFeatureFlag } from "../../providers/feature-flag-provider"

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
  const { isFeatureEnabled } = useFeatureFlag()

  const showContent = isFeatureEnabled(featureFlag) === !showOnlyWhenDisabled
  return showContent ? <>{children}</> : null
}

export default FeatureToggle
