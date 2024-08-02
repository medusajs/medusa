"use client"

import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { ToCItem } from "types"
import { useIsBrowser } from "../.."
import { TocList } from "./List"

export const Toc = () => {
  const [items, setItems] = useState<ToCItem[]>([])
  const isBrowser = useIsBrowser()
  const pathname = usePathname()

  const formatHeadingContent = (content: string | null): string => {
    return content?.replaceAll(/#$/g, "") || ""
  }

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const headings = document.querySelectorAll("h2,h3")

    const itemsToSet: ToCItem[] = []
    let lastLevel2HeadingIndex = -1

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.replace("H", ""))
      const isLevel2 = level === 2
      const headingItem: ToCItem = {
        title: formatHeadingContent(heading.textContent),
        id: heading.id,
        level,
        children: [],
      }

      if (isLevel2 || lastLevel2HeadingIndex === -1) {
        itemsToSet.push(headingItem)
        if (isLevel2) {
          lastLevel2HeadingIndex = itemsToSet.length - 1
        }
      } else if (lastLevel2HeadingIndex !== -1) {
        itemsToSet[lastLevel2HeadingIndex].children?.push(headingItem)
      }
    })

    setItems(itemsToSet)
  }, [pathname, isBrowser])

  return <TocList items={items} />
}
