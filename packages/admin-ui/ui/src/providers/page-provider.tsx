import { Link, Route, RouteRegistry } from "@medusajs/admin-shared"
import React, { PropsWithChildren, useCallback, useMemo } from "react"

type RouteContextType = {
  getRoutes: () => Route[]
  getNestedRoutes: (parent: string) => Route[]
  getLinks: () => Link[]
}

const RouteContext = React.createContext<RouteContextType | null>(null)

export const usePages = () => {
  const context = React.useContext(RouteContext)

  if (!context) {
    throw new Error("useWidgets must be used within a WidgetContext")
  }

  return context
}

type RouteProviderProps = PropsWithChildren<{
  registry: RouteRegistry
}>

export const RouteProvider = ({ registry, children }: RouteProviderProps) => {
  const getRoutes = useCallback(() => {
    return registry.getRoutes()
  }, [registry])

  const getNestedRoutes = useCallback(
    (parent: string) => {
      return registry.getNestedRoutes(parent)
    },
    [registry]
  )

  const getLinks = useCallback(() => {
    return registry.getLinks()
  }, [registry])

  const values = useMemo(
    () => ({ getRoutes, getNestedRoutes, getLinks }),
    [getRoutes, getNestedRoutes, getLinks]
  )

  return (
    <RouteContext.Provider value={values}>{children}</RouteContext.Provider>
  )
}
