"use client"

import { usePathname } from "next/navigation"
import { useScrollController } from "../use-scroll-utils"
import { useEffect, useState } from "react"
import { getScrolledTop, isElmWindow } from "../../utils"

export const usePageScrollManager = () => {
  const pathname = usePathname()
  const { scrollableElement } = useScrollController()
  const [checkedPageReload, setCheckedPageReload] = useState(false)

  const isPageReloaded = () =>
    (window.performance.navigation &&
      window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType("navigation")
      .map((nav) => (nav as PerformanceNavigationTiming).type)
      .includes("reload")

  useEffect(() => {
    if (!scrollableElement || !checkedPageReload) {
      return
    }

    if (getScrolledTop(scrollableElement) !== 0 && !location.hash) {
      scrollableElement?.scrollTo({
        top: 0,
      })
    } else if (location.hash) {
      // retrieve and scroll to element
      const targetElm =
        scrollableElement && typeof document !== "undefined"
          ? document.getElementById(location.hash.replace("#", ""))
          : undefined

      targetElm?.scrollIntoView()
    }
  }, [pathname, scrollableElement])

  useEffect(() => {
    if (!scrollableElement || checkedPageReload) {
      return
    }

    if (isPageReloaded()) {
      const loadedScrollPosition = localStorage.getItem("scrollPos")
      if (loadedScrollPosition) {
        scrollableElement?.scrollTo({
          top: parseInt(loadedScrollPosition),
        })
      }
      localStorage.removeItem("scrollPos")
    }

    setCheckedPageReload(true)

    window.addEventListener("beforeunload", () => {
      const scrollPos = isElmWindow(scrollableElement)
        ? scrollableElement.screenY
        : scrollableElement?.scrollTop

      if (scrollPos) {
        localStorage.setItem(
          "scrollPos",
          `${
            isElmWindow(scrollableElement)
              ? scrollableElement.screenY
              : scrollableElement?.scrollTop
          }`
        )
      }
    })
  }, [scrollableElement])
}
