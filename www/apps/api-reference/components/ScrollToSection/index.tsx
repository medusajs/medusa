"use client"

import { useEffect } from "react"
import { useScrollController } from "docs-ui"

type ScrollToSectionProps = {
  slug: string
}

/**
 * Scrolls the intro section with the given heading `id` into view on load,
 * used by the intro-section pages (`/[area]/[section]`) which render the full
 * intro content and focus one section.
 */
const ScrollToSection = ({ slug }: ScrollToSectionProps) => {
  const { scrollToElement, scrollableElement } = useScrollController()

  useEffect(() => {
    if (!scrollableElement) {
      return
    }

    let cancelled = false
    const attempt = (tries = 0) => {
      if (cancelled) {
        return
      }
      const el = document.getElementById(slug)
      if (el) {
        scrollToElement((el.offsetParent as HTMLElement) || el)
      } else if (tries < 20) {
        setTimeout(() => attempt(tries + 1), 100)
      }
    }
    attempt()

    return () => {
      cancelled = true
    }
  }, [slug, scrollableElement])

  return null
}

export default ScrollToSection
