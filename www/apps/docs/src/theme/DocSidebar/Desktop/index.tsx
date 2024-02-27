import React, { useEffect, useRef } from "react"
import clsx from "clsx"
import { useThemeConfig } from "@docusaurus/theme-common"
import AnnouncementBar from "@theme/AnnouncementBar"
import Content from "@theme/DocSidebar/Desktop/Content"
import type { Props } from "@theme/DocSidebar/Desktop"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"

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
        "lg:flex lg:flex-col lg:max-h-screen lg:h-full lg:sticky lg:top-0 lg:transition-opacity lg:duration-[50ms] lg:ease-ease lg:pt-1.5",
        "sidebar-desktop",
        hideOnScroll && "lg:pt-0"
      )}
      ref={sidebarRef}
    >
      <AnnouncementBar />
      <Content
        path={path}
        sidebar={sidebar}
        className={clsx("main-sidebar", "!mt-0 !pt-0 !px-1.5 !pb-4")}
      />
    </div>
  )
}

export default React.memo(DocSidebarDesktop)
