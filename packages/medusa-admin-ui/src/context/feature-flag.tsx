import { useAdminStore } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { AccountContext } from "./account"

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
  const { isLoggedIn } = useContext(AccountContext)

  const [featureFlags, setFeatureFlags] = useState<
    { key: string; value: boolean }[]
  >([])

  const { store, isFetching } = useAdminStore()

  useEffect(() => {
    if (
      isFetching ||
      !store ||
      !isLoggedIn ||
      !store["feature_flags"]?.length
    ) {
      return
    }

    setFeatureFlags(store["feature_flags"])
  }, [isFetching, store, isLoggedIn])

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
