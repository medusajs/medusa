import { createContext } from "react"

type RouteModalProviderState = {
  handleSuccess: (path?: string) => void
}

export const RouteModalProviderContext =
  createContext<RouteModalProviderState | null>(null)
