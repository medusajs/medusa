"use client"

import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import type { SidebarItemType } from "@/providers/sidebar"
import getSectionId from "@/utils/get-section-id"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

export type SectionProps = {
  addToSidebar?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

const Section = ({
  addToSidebar = true,
  children,
  className,
}: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { addItems } = useSidebar()
  const [scannedHeading, setScannedHeading] = useState(false)

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
          })
          heading.id = id
        }
      })
      addItems(items, {
        section: SidebarItemSections.TOP,
        indexPosition: 0,
      })
    }
  }, [sectionRef, addToSidebar, addItems, scannedHeading])

  return (
    <div ref={sectionRef} className={clsx("w-api-ref-content", "section-content", className)}>
      {children}
    </div>
  )
}

export default Section
