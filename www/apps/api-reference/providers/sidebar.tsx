"use client"
import {
  SidebarProvider as UiSidebarProvider,
  mobileSidebarItems,
  usePageLoading,
  useScrollController,
} from "docs-ui"
import { config } from "../config"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      scrollableElement={scrollableElement}
      initialItems={config.sidebar}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
