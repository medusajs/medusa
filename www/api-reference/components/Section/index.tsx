"use client"

import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import type { SidebarItemType } from "@/providers/sidebar"
import getSectionId from "@/utils/get-section-id"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import checkElementVisibility from "../../utils/check-element-visibility"

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        return
      }
      const headings = [...(sectionRef.current?.querySelectorAll("h2") || [])]
      headings.some((heading) => {
        if (
          checkElementVisibility(heading, document.body, {
            topMargin: 57,
          }) &&
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
    }
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

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [
    sectionRef,
    addToSidebar,
    addItems,
    scannedHeading,
    activePath,
    setActivePath,
  ])

  return (
    <div
      ref={sectionRef}
      className={clsx(
        "[&_pre]:dark:border-medusa-code-block-border [&_pre]:rounded [&_pre]:border [&_pre]:border-transparent",
        "[&_ul]:list-disc [&_ul]:px-1",
        "[&_h2]:mt-0 [&_h2]:pt-[57px] [&_hr]:mt-[57px] [&_hr]:mb-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Section
