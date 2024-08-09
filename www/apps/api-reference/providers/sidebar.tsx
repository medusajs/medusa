"use client"
import {
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  usePrevious,
  useScrollController,
} from "docs-ui"
import { config } from "../config"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()
  const pathname = usePathname()
  const prevPathname = usePrevious(pathname)

  const resetOnCondition = useCallback(
    () => prevPathname !== undefined && prevPathname !== pathname,
    [pathname, prevPathname]
  )

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      scrollableElement={scrollableElement}
      initialItems={config.sidebar}
      resetOnCondition={resetOnCondition}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
