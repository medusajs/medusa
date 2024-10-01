"use client"

import clsx from "clsx"
import { useActiveOnScroll, useSidebar } from "docs-ui"
import { useEffect, useRef } from "react"

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

  useEffect(() => {
    if ("scrollRestoration" in history) {
      // disable scroll on refresh
      history.scrollRestoration = "manual"
    }
  }, [])

  useEffect(() => {
    if (activeItemId.length) {
      history.pushState({}, "", `#${activeItemId}`)
      setActivePath(activeItemId)
    }
  }, [activeItemId])

  return (
    <div
      ref={sectionRef}
      className={clsx("[&_ul]:list-disc [&_ul]:px-1", "[&_h2]:pt-7", className)}
    >
      {children}
    </div>
  )
}

export default Section
