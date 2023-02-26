import { useAdminGetSession, useAdminStore } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"

export const defaultFeatureFlagContext: {
  featureToggleList: Record<string, boolean>
  isFeatureEnabled: (flag: string) => boolean
} = {
  featureToggleList: {},
  isFeatureEnabled: function (flag): boolean {
    return !!this.featureToggleList[flag]
  },
}

export const FeatureFlagContext = React.createContext(defaultFeatureFlagContext)

export const FeatureFlagProvider = ({ children }) => {
  const { user, isLoading } = useAdminGetSession()

  const [featureFlags, setFeatureFlags] = useState<
    { key: string; value: boolean }[]
  >([])

  const { store, isFetching } = useAdminStore()

  useEffect(() => {
    if (
      isFetching ||
      !store ||
      (!user && !isLoading) ||
      !store["feature_flags"]?.length
    ) {
      return
    }

    setFeatureFlags([
      ...store["feature_flags"],
      ...store["modules"].map((module) => ({
        key: module.module,
        value: true,
      })),
    ])
  }, [isFetching, store, user, isLoading])

  const featureToggleList = featureFlags.reduce(
    (acc, flag) => ({ ...acc, [flag.key]: flag.value }),
    {}
  )

  const isFeatureEnabled = (flag: string) => !!featureToggleList[flag]

  return (
    <FeatureFlagContext.Provider
      value={{ isFeatureEnabled, featureToggleList }}
    >
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlag = () => {
  const context = useContext(FeatureFlagContext)

  if (!context) {
    throw new Error("useFeatureFlag must be used within a FeatureFlagProvider")
  }

  return context
}
