import React, { PropsWithChildren, useCallback, useMemo } from "react"
import SettingRegistry from "../registries/setting-registry"
import { Card, Setting } from "../types/extensions"

type SettingContextType = {
  getSettings: () => Setting[]
  getCards: () => Card[]
}

const SettingContext = React.createContext<SettingContextType | null>(null)

export const useSettings = () => {
  const context = React.useContext(SettingContext)

  if (!context) {
    throw new Error("useSettings must be used within a SettingContext")
  }

  return context
}

type SettingProviderProps = PropsWithChildren<{
  registry: SettingRegistry
}>

export const SettingProvider = ({
  registry,
  children,
}: SettingProviderProps) => {
  const getSettings = useCallback(() => {
    return registry.getSettings()
  }, [registry])

  const getCards = useCallback(() => {
    return registry.getCards()
  }, [registry])

  const values = useMemo(
    () => ({
      getSettings,
      getCards,
    }),
    [getSettings, getCards]
  )

  return (
    <SettingContext.Provider value={values}>{children}</SettingContext.Provider>
  )
}
