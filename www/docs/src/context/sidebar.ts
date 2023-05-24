import { createContext } from "react"

type SidebarContextType = {
  hasSidebar: boolean
  hiddenSidebar: boolean
  setHiddenSidebar: (value: boolean) => void
  hiddenSidebarContainer: boolean
  setHiddenSidebarContainer: (value: boolean) => void
  floatingSidebar: boolean
  setFloatingSidebar: (value: boolean) => void
  onCollapse: () => void
}

export const SidebarContext = createContext<SidebarContextType | null>(null)
