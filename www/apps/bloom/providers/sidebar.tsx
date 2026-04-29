"use client"
import {
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { config } from "@/config"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()

  return (
    <UiSidebarProvider
      scrollableElement={scrollableElement}
      sidebars={config.sidebars}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
