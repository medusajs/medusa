import type { SidebarItemType } from "@/providers/sidebar"
import { useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import type { MethodLabelProps } from "../../MethodLabel"
import checkSidebarItemVisibility from "@/utils/check-sidebar-item-visibility"
import Loading from "../../Loading"

const MethodLabel = dynamic<MethodLabelProps>(
  async () => import("../../MethodLabel")
) as React.FC<MethodLabelProps>

export type SidebarItemProps = {
  item: SidebarItemType
  nested?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

const SidebarItem = ({ item, nested = false, className }: SidebarItemProps) => {
  const [showLoading, setShowLoading] = useState(false)
  const { isItemActive, setMobileSidebarOpen: setSidebarOpen } = useSidebar()
  const active = useMemo(() => {
    return isItemActive(item, nested)
  }, [isItemActive, item, nested])
  const collapsed = !isItemActive(item, true)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (active && ref.current && window.innerWidth >= 1025) {
      if (
        !checkSidebarItemVisibility(ref.current, {
          topMargin: 57,
        })
      ) {
        // scroll to element
        ref.current.scrollIntoView({
          block: "center",
        })
      }
    }
    if (active) {
      setShowLoading(true)
    }
  }, [active])

  return (
    <li
      className={clsx(
        item.hasChildren && !collapsed && "my-1.5",
        !item.hasChildren && !nested && active && "mt-1.5",
        ((item.hasChildren && !collapsed) ||
          (!item.hasChildren && !nested && active)) &&
          "-translate-y-1 transition-transform",
        className
      )}
      ref={ref}
    >
      <Link
        href={item.isPathHref ? item.path : `#${item.path}`}
        className={clsx(
          "flex items-center justify-between gap-0.5 rounded-sm border px-0.5 py-[6px] hover:no-underline",
          !item.hasChildren &&
            "text-compact-small-plus text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
          item.hasChildren &&
            "text-compact-x-small-plus text-medusa-fg-muted dark:text-medusa-fg-muted-dark uppercase",
          active &&
            "!text-medusa-fg-base dark:!text-medusa-fg-base-dark bg-medusa-bg-base-pressed dark:bg-medusa-bg-base-pressed-dark",
          active &&
            "border-medusa-border-base dark:border-medusa-border-base-dark",
          !active &&
            "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark border-transparent"
        )}
        scroll={true}
        onClick={() => {
          if (window.innerWidth < 1025) {
            setSidebarOpen(false)
          }
        }}
        replace
        shallow
      >
        <span>{item.title}</span>
        {item.method && <MethodLabel method={item.method} className="h-fit" />}
      </Link>
      {item.hasChildren && (
        <ul
          className={clsx("ease-ease overflow-hidden", collapsed && "m-0 h-0")}
        >
          {showLoading && !item.loaded && (
            <Loading
              count={3}
              className="!mb-0 !px-0.5"
              barClassName="h-[20px]"
            />
          )}
          {item.children?.map((childItem, index) => (
            <SidebarItem item={childItem} key={index} nested={true} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default SidebarItem
