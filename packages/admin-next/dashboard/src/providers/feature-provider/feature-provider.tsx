import { useAdminStore } from "medusa-react"
import { PropsWithChildren, useEffect, useState } from "react"
import { FeatureContext } from "./feature-context"
import { Feature } from "./types"

export const FeatureProvider = ({ children }: PropsWithChildren) => {
  const { store, isLoading } = useAdminStore()
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    if (!store || isLoading) {
      return
    }

    const flags = store.feature_flags
      .filter((f) => f.value === true)
      .map((f) => f.key)
    const modules = store.modules.map((m) => m.module)
    const enabled = flags.concat(modules)

    setFeatures(enabled as Feature[])
  }, [store, isLoading])

  function isFeatureEnabled(feature: Feature) {
    return features.includes(feature)
  }

  return (
    <FeatureContext.Provider value={{ isFeatureEnabled }}>
      {children}
    </FeatureContext.Provider>
  )
}
