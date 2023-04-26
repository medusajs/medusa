import { InjectionZone, InjectionZones, LoadedWidget } from "@medusajs/types"
import React, { PropsWithChildren, useCallback, useMemo } from "react"

type InjectionContextType = {
  getWidgets: (injectionZone: InjectionZone) => LoadedWidget[]
}

const InjectionContext = React.createContext<InjectionContextType | null>(null)

export const useInjectionZones = () => {
  const context = React.useContext(InjectionContext)

  if (!context) {
    throw new Error(
      "useInjectionContext must be used within a InjectionProvider"
    )
  }

  return context
}

type InjectionProviderProps = PropsWithChildren<{
  injectionZoneMap: InjectionZones
}>

export const InjectionZoneProvider = ({
  injectionZoneMap,
  children,
}: InjectionProviderProps) => {
  const getWidgets = useCallback(
    (injectionZone: InjectionZone) => {
      return injectionZoneMap.get(injectionZone) || []
    },
    [injectionZoneMap]
  )

  const values = useMemo(() => ({ getWidgets }), [getWidgets])

  return (
    <InjectionContext.Provider value={values}>
      {children}
    </InjectionContext.Provider>
  )
}
