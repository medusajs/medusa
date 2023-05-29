import React, { useEffect, useRef } from "react"
import clsx from "clsx"
import { useThemeConfig } from "@docusaurus/theme-common"
import Content from "@theme/DocSidebar/Desktop/Content"
import type { Props } from "@theme/DocSidebar/Desktop"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"
import AnnouncementBar from "../../AnnouncementBar/index"

function DocSidebarDesktop({ path, sidebar }: Props) {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig()
  const isBrowser = useIsBrowser()
  const sidebarRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function handleScroll() {
      if (!sidebarRef.current?.classList.contains("scrolling")) {
        sidebarRef.current?.classList.add("scrolling")
        const intervalId = setInterval(() => {
          if (!sidebarRef.current?.matches(":hover")) {
            sidebarRef.current?.classList.remove("scrolling")
            clearInterval(intervalId)
          }
        }, 300)
      }
    }

    if (isBrowser && sidebarRef.current) {
      const navElement = sidebarRef.current.querySelector(".main-sidebar")
      navElement.addEventListener("scroll", handleScroll)

      return () => {
        navElement?.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isBrowser, sidebarRef.current])

  useEffect(() => {
    const navElement = sidebarRef.current.querySelector(".main-sidebar")
    const navElementBoundingRect = navElement.getBoundingClientRect()

    // logic to scroll to current active item
    const activeItem = document.querySelector(
      ".sidebar-desktop [aria-current=page]"
    )

    if (!activeItem) {
      return
    }

    const activeItemBoundingReact = activeItem.getBoundingClientRect()
    // the extra 160 is due to the sticky elements in the sidebar
    const isActiveItemVisible =
      activeItemBoundingReact.top >= 0 &&
      activeItemBoundingReact.bottom + 160 <= navElementBoundingRect.height

    if (!isActiveItemVisible) {
      const elementToScrollTo = activeItem
      const elementBounding = elementToScrollTo.getBoundingClientRect()
      // scroll to element
      navElement.scroll({
        // the extra 160 is due to the sticky elements in the sidebar
        top:
          elementBounding.top -
          navElementBoundingRect.top +
          navElement.scrollTop -
          160,
        behaviour: "smooth",
      })
    }
  }, [location])

  return (
    <div
      className={clsx(
        "lg:tw-flex lg:tw-flex-col lg:tw-max-h-screen lg:tw-h-full lg:tw-sticky lg:tw-top-0 lg:tw-transition-opacity lg:tw-duration-[50ms] lg:tw-ease-ease lg:tw-pt-1.5",
        "sidebar-desktop",
        hideOnScroll && "lg:tw-pt-0"
      )}
      ref={sidebarRef}
    >
      <AnnouncementBar />
      <Content
        path={path}
        sidebar={sidebar}
        className={clsx(
          "main-sidebar",
          "!tw-mt-0 !tw-pt-0 !tw-px-1.5 !tw-pb-4"
        )}
      />
    </div>
  )
}

export default React.memo(DocSidebarDesktop)
