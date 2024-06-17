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
      shouldHandlePathChange={true}
      shouldHandleHashChange={false}
      scrollableElement={scrollableElement}
      initialItems={config.sidebar}
      staticSidebarItems={true}
      disableActiveTransition={true}
      noTitleStyling={true}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
