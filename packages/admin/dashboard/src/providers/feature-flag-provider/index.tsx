import React, { createContext, useContext } from "react"
import { useFeatureFlags, FeatureFlags } from "../../hooks/api/feature-flags"

interface FeatureFlagContextValue {
  flags: FeatureFlags
  isLoading: boolean
  isFeatureEnabled: (flag: keyof FeatureFlags) => boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null)

export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  const context = useContext(FeatureFlagContext)
  if (!context) {
    // If no context, assume feature is disabled
    return false
  }
  return context.isFeatureEnabled(flag)
}

export const useFeatureFlagContext = () => {
  const context = useContext(FeatureFlagContext)
  if (!context) {
    throw new Error(
      "useFeatureFlagContext must be used within FeatureFlagProvider"
    )
  }
  return context
}

interface FeatureFlagProviderProps {
  children: React.ReactNode
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
}) => {
  const { data: flags = {}, isLoading } = useFeatureFlags()

  const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
    const enabled = flags[flag] === true
    return enabled
  }

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
