"use client"

import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import type { SidebarItemType } from "@/providers/sidebar"
import getSectionId from "@/utils/get-section-id"
import clsx from "clsx"
import { useCallback, useEffect, useRef, useState } from "react"
import checkElementInViewport from "../../utils/check-element-in-viewport"
import { useBaseSpecs } from "../../providers/base-specs"

export type SectionProps = {
  addToSidebar?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

const Section = ({
  addToSidebar = true,
  children,
  className,
}: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { activePath, setActivePath, addItems } = useSidebar()
  const [scannedHeading, setScannedHeading] = useState(false)
  const { baseSpecs } = useBaseSpecs()

  const handleScroll = useCallback(() => {
    const headings = [...(sectionRef.current?.querySelectorAll("h2") || [])]
    if (!baseSpecs) {
      headings.some((heading) => {
        if (heading.id === (activePath || location.hash.replace("#", ""))) {
          heading.scrollIntoView()
          return true
        }
      })
      return
    }
    if (window.scrollY === 0) {
      return
    }
    headings.some((heading) => {
      if (
        checkElementInViewport(heading.parentElement || heading, 40) &&
        activePath !== heading.id
      ) {
        // can't use next router as it doesn't support
        // changing url without scrolling
        history.pushState({}, "", `#${heading.id}`)
        setActivePath(heading.id)

        return true
      }

      return false
    })
  }, [baseSpecs, activePath, setActivePath])

  useEffect(() => {
    if (sectionRef.current && addToSidebar && !scannedHeading) {
      setScannedHeading(true)
      const headings = [...sectionRef.current.querySelectorAll("h2")]
      const items: SidebarItemType[] = []
      headings.forEach((heading) => {
        if (heading.textContent) {
          const id = getSectionId([heading.textContent])
          items.push({
            path: `${id}`,
            title: heading.textContent,
            loaded: true,
          })
          heading.id = id
          if (id === activePath) {
            heading.scrollIntoView()
          }
        }
      })
      addItems(items, {
        section: SidebarItemSections.TOP,
      })
    }
  }, [
    sectionRef,
    addToSidebar,
    addItems,
    scannedHeading,
    activePath,
    setActivePath,
  ])

  useEffect(() => {
    if ("scrollRestoration" in history) {
      // disable scroll on refresh
      history.scrollRestoration = "manual"
    }

    const headings = [...(sectionRef.current?.querySelectorAll("h2") || [])]
    headings.some((heading) => {
      if (heading.id === (activePath || location.hash.replace("#", ""))) {
        heading.scrollIntoView()
        return true
      }
    })
  }, [])

  useEffect(() => {
    if (addToSidebar) {
      handleScroll()

      window.addEventListener("scroll", handleScroll, {
        passive: true,
      })

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div
      ref={sectionRef}
      className={clsx(
        "[&_pre]:dark:border-medusa-code-block-border [&_pre]:rounded [&_pre]:border [&_pre]:border-transparent",
        "[&_ul]:list-disc [&_ul]:px-1",
        "[&_h2]:pt-7",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Section
