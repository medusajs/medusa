import { createContext } from "react"

type RouteModalProviderState = {
  handleSuccess: (path?: string) => void
  setCloseOnEscape: (value: boolean) => void
  __internal: {
    closeOnEscape: boolean
  }
}

export const RouteModalProviderContext =
  createContext<RouteModalProviderState | null>(null)
