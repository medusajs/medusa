"use client"
import {
  getNavDropdownItems,
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { config } from "@/config"
import { useMemo } from "react"
import { basePathUrl } from "../utils/base-path-url"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()

  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: config.baseUrl,
        activePath: basePathUrl(),
        version: "v2",
      }),
    []
  )

  return (
    <UiSidebarProvider
      shouldHandlePathChange={true}
      shouldHandleHashChange={false}
      scrollableElement={scrollableElement}
      initialItems={config.sidebar}
      staticSidebarItems={true}
      disableActiveTransition={true}
      noTitleStyling={true}
      navigationDropdownItems={navigationDropdownItems}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
