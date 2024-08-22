"use client"

import {
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  usePrevious,
  useScrollController,
} from "docs-ui"
import { config } from "../config"
import { useCallback } from "react"
import { usePathname } from "next/navigation"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()
  const pathname = usePathname()
  const prevPathName = usePrevious(pathname)

  const resetOnCondition = useCallback(
    () => prevPathName !== undefined && pathname !== prevPathName,
    [pathname, prevPathName]
  )

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      scrollableElement={scrollableElement}
      initialItems={config.sidebar}
      resetOnCondition={resetOnCondition}
      persistState={false}
      projectName="api"
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
