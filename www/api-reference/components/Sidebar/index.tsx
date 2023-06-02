"use client"

import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import fetcher from "@/utils/swr-fetcher"
import clsx from "clsx"
import { OpenAPIV3 } from "openapi-types"
import { useEffect } from "react"
import useSWR from "swr"
import SidebarItem from "./Item"
import getSectionId from "@/utils/get-section-id"

type SidebarProps = {
  className?: string
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const { items, addItems } = useSidebar()
  const { data: specs } = useSWR<OpenAPIV3.Document>("/api/base-specs", fetcher)

  useEffect(() => {
    if (specs) {
      addItems(
        specs.tags?.map((tag) => ({
          path: getSectionId([tag.name.toLowerCase()]),
          title: tag.name,
        })) || [],
        {
          section: SidebarItemSections.BOTTOM,
        }
      )
    }
  }, [specs, addItems])

  return (
    <aside
      className={clsx(
        "clip bg-docs-bg dark:bg-docs-bg-dark w-api-ref-sidebar block",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-r border-solid",
        className
      )}
    >
      <ul
        className={clsx(
          "sticky top-0 h-screen max-h-screen w-full list-none overflow-auto p-0"
        )}
      >
        {items.top.map((item, index) => (
          <SidebarItem
            item={item}
            key={item.path}
            className={clsx(
              index === items.top.length - 1 &&
                "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-b border-solid"
            )}
          />
        ))}
        {items.bottom.map((item) => (
          <SidebarItem item={item} key={item.path} />
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
