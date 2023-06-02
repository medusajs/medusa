"use client"

import {
  SidebarItemSections,
  SidebarItemType,
  useSidebar,
} from "@/providers/sidebar"
import getSectionId from "@/utils/get-section-id"
import { useEffect, useRef, useState } from "react"

type SectionProps = {
  content: React.ReactNode
  addToSidebar?: boolean
}

const Section = ({ addToSidebar = true, content }: SectionProps) => {
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
    <div ref={sectionRef} className="w-api-ref-content">
      {content}
    </div>
  )
}

export default Section
