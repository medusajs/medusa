import React from "react"
import clsx from "clsx"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import type { Props } from "@theme/DocPage/Layout/Main"
import { useSidebar } from "@site/src/providers/Sidebar"

export default function DocPageLayoutMain({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useSidebar()
  return (
    <main
      className={clsx(
        "tw-flex tw-flex-col tw-w-full lg:tw-flex-grow",
        (sidebarContext?.hiddenSidebarContainer || !sidebar) &&
          "lg:tw-max-w-[calc(100%-30px)]",
        !sidebarContext?.hiddenSidebarContainer &&
          "xxl:tw-max-w-[1119px] lg:tw-max-w-[calc(100%-321px)]"
      )}
    >
      <div
        className={clsx(
          "container padding-top--md tw-px-0",
          sidebarContext?.hiddenSidebarContainer &&
            "lg:tw-max-w-main-content-hidden-sidebar"
        )}
      >
        {children}
      </div>
    </main>
  )
}
