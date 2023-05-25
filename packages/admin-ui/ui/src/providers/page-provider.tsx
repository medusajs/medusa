import { Link, PageRegistry, Route } from "@medusajs/admin-shared"
import React, { PropsWithChildren, useCallback, useMemo } from "react"

type PageContextType = {
  getRoutes: () => Route[]
  getLinks: () => Link[]
}

const PageContext = React.createContext<PageContextType | null>(null)

export const usePages = () => {
  const context = React.useContext(PageContext)

  if (!context) {
    throw new Error("useWidgets must be used within a WidgetContext")
  }

  return context
}

type PageProviderProps = PropsWithChildren<{
  registry: PageRegistry
}>

export const PageProvider = ({ registry, children }: PageProviderProps) => {
  const getRoutes = useCallback(() => {
    return registry.getRoutes()
  }, [registry])

  const getLinks = useCallback(() => {
    return registry.getLinks()
  }, [registry])

  const values = useMemo(() => ({ getRoutes, getLinks }), [getRoutes, getLinks])

  return <PageContext.Provider value={values}>{children}</PageContext.Provider>
}
