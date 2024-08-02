import {
  getNavDropdownItems,
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { docsConfig } from "@/config/docs"
import { useMemo } from "react"
import { basePathUrl } from "../lib/base-path-url"
import { siteConfig } from "../config/site"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()

  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: siteConfig.baseUrl,
        activePath: basePathUrl(),
        version: "v1",
      }),
    []
  )

  return (
    <UiSidebarProvider
      initialItems={docsConfig.sidebar}
      shouldHandlePathChange={true}
      scrollableElement={scrollableElement}
      disableActiveTransition={true}
      navigationDropdownItems={navigationDropdownItems}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
