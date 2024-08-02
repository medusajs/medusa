"use client"
import {
  getNavDropdownItems,
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  usePrevious,
  useScrollController,
} from "docs-ui"
import { config } from "../config"
import { useCallback, useMemo } from "react"
import basePathUrl from "../utils/base-path-url"
import { usePathname } from "next/navigation"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()
  const pathname = usePathname()
  const prevPathName = usePrevious(pathname)

  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: config.baseUrl,
        activePath: basePathUrl(pathname),
        version: "v2",
      }),
    [pathname]
  )

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
      navigationDropdownItems={navigationDropdownItems}
      resetOnCondition={resetOnCondition}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
