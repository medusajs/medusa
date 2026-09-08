"use client"

import React from "react"
import clsx from "clsx"
import { useActiveOnScroll, useSidebar } from "docs-ui"
import { useEffect, useRef } from "react"
import { useArea } from "@/providers/area"
import basePathUrl from "../../utils/base-path-url"

export type SectionProps = {
  checkActiveOnScroll?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

const Section = ({
  children,
  className,
  checkActiveOnScroll = false,
}: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { activeItemId } = useActiveOnScroll({
    rootElm: sectionRef.current || undefined,
    enable: checkActiveOnScroll,
    useDefaultIfNoActive: false,
    maxLevel: 2,
  })
  const { setActivePath } = useSidebar()
  const { area } = useArea()

  useEffect(() => {
    if ("scrollRestoration" in history) {
      // disable scroll on refresh
      history.scrollRestoration = "manual"
    }
  }, [])

  useEffect(() => {
    if (!activeItemId.length) {
      return
    }

    // map the intro heading in view to its page path (the top "introduction"
    // heading maps to the area index).
    const path =
      activeItemId === "introduction" ? `/${area}` : `/${area}/${activeItemId}`
    window.history.replaceState(null, "", basePathUrl(path))
    setActivePath(path)
  }, [activeItemId, area])

  return (
    <div
      ref={sectionRef}
      className={clsx("[&_ul]:list-disc [&_ul]:px-1", "[&_h2]:pt-7", className)}
      data-active-on-scroll={checkActiveOnScroll || undefined}
    >
      {children}
    </div>
  )
}

export default Section
