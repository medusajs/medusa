import React, { useContext, useState } from "react"
import {
  useDocsSidebar,
  useQueryStringValue,
} from "@docusaurus/theme-common/internal"
import Layout from "@theme/Layout"
import BackToTopButton from "@theme/BackToTopButton"
import DocPageLayoutSidebar from "@theme/DocPage/Layout/Sidebar"
import DocPageLayoutMain from "@theme/DocPage/Layout/Main"
import type { Props } from "@theme/DocPage/Layout"
import { SidebarContext } from "@site/src/context/sidebar"
import clsx from "clsx"
import Notification from "@site/src/components/Notification"
import Rating from "@site/src/components/Rating"

export default function DocPageLayout({ children }: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  const sidebarContext = useContext(SidebarContext)
  const isOnboarding = useQueryStringValue("ref") === "onboarding"
  const [showNotification, setShowNotification] = useState(isOnboarding)

  const handleRating = () => {
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
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
          {isOnboarding && (
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
        </DocPageLayoutMain>
      </div>
    </Layout>
  )
}
