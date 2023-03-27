import React, { PropsWithChildren, useCallback, useMemo } from "react"
import { Component } from "../medusa-app"

type InjectionContextType = {
  getComponents: (view: string, zone: string) => Component[]
}

const InjectionContext = React.createContext<InjectionContextType | null>(null)

export const useInjectionContext = () => {
  const context = React.useContext(InjectionContext)

  if (!context) {
    throw new Error(
      "useInjectionContext must be used within a InjectionProvider"
    )
  }

  return context
}

type InjectionProviderProps = PropsWithChildren<{
  injectionZones: Record<string, Record<string, Component[]>>
}>

export const InjectionProvider = ({
  injectionZones,
  children,
}: InjectionProviderProps) => {
  const getComponents = useCallback(
    (view: string, zone: string) => {
      if (!injectionZones[view]) {
        console.warn(`No injection zone found for view ${view}`)
        return []
      }

      if (!injectionZones[view][zone]) {
        console.warn(`No injection zone found for zone ${zone}`)
        return []
      }

      return injectionZones[view][zone]
    },
    [injectionZones]
  )

  const values = useMemo(() => ({ getComponents }), [getComponents])

  return (
    <InjectionContext.Provider value={values}>
      {children}
    </InjectionContext.Provider>
  )
}
