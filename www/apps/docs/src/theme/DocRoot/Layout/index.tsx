import React from "react"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import BackToTopButton from "@theme/BackToTopButton"
import DocRootLayoutSidebar from "@theme/DocRoot/Layout/Sidebar"
import DocRootLayoutMain from "@theme/DocRoot/Layout/Main"
import type { Props } from "@theme/DocRoot/Layout"

import useOnboarding from "../../../hooks/use-onboarding"
import useCurrentLearningPath from "../../../hooks/use-current-learning-path"
import { useSidebar } from "../../../providers/Sidebar"
import clsx from "clsx"

export default function DocRootLayout({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useSidebar()
  useOnboarding()
  useCurrentLearningPath()
  return (
    <div className={clsx("flex flex-[1_0_auto]")}>
      <BackToTopButton />
      <div className={clsx("flex w-full flex-[1_0]")}>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={sidebarContext?.hiddenSidebarContainer}
            setHiddenSidebarContainer={
              sidebarContext?.setHiddenSidebarContainer
            }
          />
        )}
        <DocRootLayoutMain
          hiddenSidebarContainer={sidebarContext?.hiddenSidebarContainer}
        >
          {children}
        </DocRootLayoutMain>
      </div>
    </div>
  )
}
