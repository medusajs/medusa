"use client"

import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import { useEffect } from "react"
import getSectionId from "@/utils/get-section-id"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import { SidebarItemProps } from "./Item"
import Loading from "../Loading"

const SidebarItem = dynamic<SidebarItemProps>(async () => import("./Item"), {
  loading: () => <Loading />,
}) as React.FC<SidebarItemProps>

type SidebarProps = {
  className?: string
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const { items, addItems } = useSidebar()
  const { baseSpecs } = useBaseSpecs()

  useEffect(() => {
    if (baseSpecs) {
      addItems(
        baseSpecs.tags?.map((tag) => ({
          path: getSectionId([tag.name.toLowerCase()]),
          title: tag.name,
        })) || [],
        {
          section: SidebarItemSections.BOTTOM,
        }
      )
    }
  }, [baseSpecs, addItems])

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
          "sticky top-[57px] h-screen max-h-screen w-full list-none overflow-auto p-0"
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
