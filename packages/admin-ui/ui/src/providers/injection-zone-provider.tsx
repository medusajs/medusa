import { InjectionZone, Widget, WidgetRegistry } from "@medusajs/admin-shared"
import React, { PropsWithChildren, useCallback, useMemo } from "react"

type WidgetContextType = {
  getWidgets: (injectionZone: InjectionZone) => Widget[]
}

const InjectionContext = React.createContext<WidgetContextType | null>(null)

export const useWidgets = () => {
  const context = React.useContext(InjectionContext)

  if (!context) {
    throw new Error(
      "useInjectionContext must be used within a InjectionProvider"
    )
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
    <InjectionContext.Provider value={values}>
      {children}
    </InjectionContext.Provider>
  )
}
