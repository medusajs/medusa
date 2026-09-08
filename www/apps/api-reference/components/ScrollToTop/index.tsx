"use client"

import { useEffect } from "react"
import { useScrollController } from "docs-ui"

/**
 * Resets the scroll container to the top on mount. `#main` lives in the
 * persistent layout, so its scroll position is retained across client
 * navigation. Tag/operation and intro-section pages scroll to their own target,
 * but the area index (`/[area]`) has none — without this it would inherit the
 * previous page's offset (appearing "scrolled down" by the navbar height).
 */
const ScrollToTop = () => {
  const { scrollableElement } = useScrollController()

  useEffect(() => {
    if (!scrollableElement) {
      return
    }

    scrollableElement.scrollTo({ top: 0 })
  }, [scrollableElement])

  return null
}

export default ScrollToTop
