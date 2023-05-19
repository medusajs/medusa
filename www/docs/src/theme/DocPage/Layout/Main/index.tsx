import React from "react"
import clsx from "clsx"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import type { Props } from "@theme/DocPage/Layout/Main"

export default function DocPageLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  return (
    <main
      className={clsx(
        "tw-flex tw-flex-col tw-w-full lg:tw-flex-grow lg:tw-max-w-[calc(100%-320px)]",
        (hiddenSidebarContainer || !sidebar) && "lg:tw-max-w-[calc(100%-30px)]"
      )}
    >
      <div
        className={clsx(
          "container padding-top--md tw-px-0",
          hiddenSidebarContainer && "lg:tw-max-w-main-content-hidden-sidebar"
        )}
      >
        {children}
      </div>
    </main>
  )
}
