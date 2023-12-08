import React, { PropsWithChildren, useCallback, useMemo } from "react"
import RouteRegistry from "../registries/route-registry"
import { Link, Route, RouteSegment } from "../types/extensions"

type RouteContextType = {
  getTopLevelRoutes: () => (Route | RouteSegment)[]
  getNestedRoutes: (parent: string) => Route[]
  getLinks: () => Link[]
}

const RouteContext = React.createContext<RouteContextType | null>(null)

export const useRoutes = () => {
  const context = React.useContext(RouteContext)

  if (!context) {
    throw new Error("useRoutes must be used within a RouteContext")
  }

  return context
}

type RouteProviderProps = PropsWithChildren<{
  registry: RouteRegistry
}>

export const RouteProvider = ({ registry, children }: RouteProviderProps) => {
  const getTopLevelRoutes = useCallback(() => {
    return registry.getTopLevelRoutes()
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
    () => ({
      getTopLevelRoutes,
      getNestedRoutes,
      getLinks,
    }),
    [getTopLevelRoutes, getNestedRoutes, getLinks]
  )

  return (
    <RouteContext.Provider value={values}>{children}</RouteContext.Provider>
  )
}
