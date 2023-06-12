import React, { PropsWithChildren, useCallback, useMemo } from "react"
import WidgetRegistry from "../registries/widget-registry"
import { InjectionZone, Widget } from "../types/extensions"

type WidgetContextType = {
  getWidgets: (injectionZone: InjectionZone) => Widget[]
}

const WidgetContext = React.createContext<WidgetContextType | null>(null)

export const useWidgets = () => {
  const context = React.useContext(WidgetContext)

  if (!context) {
    throw new Error("useWidgets must be used within a WidgetContext")
  }

  return context
}

type WidgetProviderProps = PropsWithChildren<{
  registry: WidgetRegistry
}>

export const WidgetProvider = ({ registry, children }: WidgetProviderProps) => {
  const getWidgets = useCallback(
    (injectionZone: InjectionZone) => {
      return registry.getWidgets(injectionZone)
    },
    [registry]
  )

  const values = useMemo(() => ({ getWidgets }), [getWidgets])

  return (
    <WidgetContext.Provider value={values}>{children}</WidgetContext.Provider>
  )
}
