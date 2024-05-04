import { createContext } from "react"

type SidebarContextValue = {
  desktop: boolean
  mobile: boolean
  toggle: (view: "desktop" | "mobile") => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
