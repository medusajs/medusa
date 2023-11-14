import React from "react"
import clsx from "clsx"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import type { Props } from "@theme/DocRoot/Layout/Main"

import { useSidebar } from "../../../../providers/Sidebar"

export default function DocRootLayoutMain({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useSidebar()
  return (
    <main
      className={clsx(
        "flex flex-col w-full lg:flex-grow",
        (sidebarContext?.hiddenSidebarContainer || !sidebar) &&
          "lg:max-w-[calc(100%-30px)]",
        !sidebarContext?.hiddenSidebarContainer &&
          "xxl:max-w-[1119px] lg:max-w-[calc(100%-321px)]"
      )}
    >
      <div
        className={clsx(
          "container padding-top--md px-0",
          sidebarContext?.hiddenSidebarContainer &&
            "lg:max-w-main-content-hidden-sidebar"
        )}
      >
        {children}
      </div>
    </main>
  )
}
