import React from "react"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import Layout from "@theme/Layout"
import BackToTopButton from "@theme/BackToTopButton"
import DocPageLayoutSidebar from "@theme/DocPage/Layout/Sidebar"
import DocPageLayoutMain from "@theme/DocPage/Layout/Main"
import type { Props } from "@theme/DocPage/Layout"
import clsx from "clsx"
import { useSidebar } from "../../../providers/Sidebar"
import useOnboarding from "../../../hooks/use-onboarding"
import useCurrentLearningPath from "../../../hooks/use-current-learning-path"

export default function DocPageLayout({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useSidebar()
  useOnboarding()
  useCurrentLearningPath()

  return (
    <Layout wrapperClassName={clsx("flex flex-[1_0_auto]")}>
      <BackToTopButton />
      <div className={clsx("flex w-full flex-[1_0]")}>
        {sidebar && (
          <DocPageLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={sidebarContext?.hiddenSidebarContainer}
            setHiddenSidebarContainer={
              sidebarContext?.setHiddenSidebarContainer
            }
          />
        )}
        <DocPageLayoutMain
          hiddenSidebarContainer={sidebarContext?.hiddenSidebarContainer}
        >
          {children}
        </DocPageLayoutMain>
      </div>
    </Layout>
  )
}
