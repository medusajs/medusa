import React, { useState } from "react"
import {
  useDocsSidebar,
  useQueryStringValue,
} from "@docusaurus/theme-common/internal"
import Layout from "@theme/Layout"
import BackToTopButton from "@theme/BackToTopButton"
import DocPageLayoutSidebar from "@theme/DocPage/Layout/Sidebar"
import DocPageLayoutMain from "@theme/DocPage/Layout/Main"
import type { Props } from "@theme/DocPage/Layout"
import clsx from "clsx"
import Rating from "@site/src/components/Rating"
import { useLearningPath } from "@site/src/providers/LearningPath"
import LearningStep from "@site/src/components/LearningPath/LearningStep"
import { useSidebar } from "@site/src/providers/Sidebar"
import Notification from "@site/src/components/Notification"

export default function DocPageLayout({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useSidebar()
  const isOnboarding = useQueryStringValue("ref") === "onboarding"
  const [showNotification, setShowNotification] = useState(isOnboarding)
  const { path } = useLearningPath()

  const handleRating = () => {
    setTimeout(() => {
      setShowNotification(false)
    }, 1500)
  }

  return (
    <Layout wrapperClassName={clsx("tw-flex tw-flex-[1_0_auto]")}>
      <BackToTopButton />
      <div className={clsx("tw-flex tw-w-full tw-flex-[1_0]")}>
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
          {isOnboarding && !path && (
            <Notification
              title="Thank you for installing Medusa!"
              text="Please rate your onboarding experience"
              type="success"
              show={showNotification}
              setShow={setShowNotification}
            >
              <Rating event="rating_onboarding" onRating={handleRating} />
            </Notification>
          )}
          {path && <LearningStep />}
        </DocPageLayoutMain>
      </div>
    </Layout>
  )
}
