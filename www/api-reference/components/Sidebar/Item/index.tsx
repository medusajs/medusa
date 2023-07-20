import type IconProps from "@/components/Icons/types"
import type { SidebarItemType } from "@/providers/sidebar"
import { useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import SpinnerLoading from "@/components/Loading/Spinner"
import type { MethodLabelProps } from "../../MethodLabel"
import checkSidebarItemVisibility from "@/utils/check-sidebar-item-visibility"

const IconChevronRightMini = dynamic<IconProps>(
  async () => import("../../Icons/ChevronRightMini"),
  {
    loading: () => <SpinnerLoading />,
  }
) as React.FC<IconProps>

const MethodLabel = dynamic<MethodLabelProps>(
  async () => import("../../MethodLabel"),
  {
    loading: () => <SpinnerLoading />,
  }
) as React.FC<MethodLabelProps>

export type SidebarItemProps = {
  item: SidebarItemType
} & React.AllHTMLAttributes<HTMLLIElement>

const SidebarItem = ({ item, className }: SidebarItemProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const { isItemActive, setActivePath, setSidebarOpen } = useSidebar()
  const active = isItemActive(item)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (active && ref.current && window.innerWidth >= 992) {
      if (
        !checkSidebarItemVisibility(ref.current, {
          topMargin: 57,
        })
      ) {
        // scroll to element
        ref.current.scrollIntoView()
      }
    }
    if (active) {
      setShowLoading(true)
    }
  }, [active])

  return (
    <li className={clsx("text-label-small-plus", className)} ref={ref}>
      <div
        className={clsx(
          "group",
          (item.children?.length || (showLoading && !item.loaded)) &&
            "flex items-center justify-between pr-0.5"
        )}
      >
        <Link
          href={item.isPathHref ? item.path : `#${item.path}`}
          className={clsx(
            "flex items-center gap-0.5 py-1 px-[20px]",
            "group-hover:text-medusa-text-base dark:group-hover:text-medusa-text-base-dark group-hover:no-underline",
            active && "text-medusa-text-base dark:text-medusa-text-base-dark",
            !active && "text-medusa-text-subtle dark:text-medusa-text-subtle"
          )}
          scroll={true}
          onClick={() => {
            setActivePath(item.path)
            setShowLoading(true)
            setSidebarOpen(false)
          }}
        >
          {item.method && (
            <MethodLabel method={item.method} className="h-fit !py-0" />
          )}
          <span>{item.title}</span>
        </Link>
        {item.children && item.children.length > 0 && (
          <button
            className={clsx(
              "cursor-pointer border-0 bg-transparent p-0 shadow-none"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <IconChevronRightMini
              iconColorClassName={clsx(
                active &&
                  "stroke-medusa-text-base dark:stroke-medusa-text-base-dark"
              )}
              containerClassName={clsx(
                collapsed &&
                  "rotate-90 transition-transform duration-200 ease-ease"
              )}
            />
          </button>
        )}
        {showLoading && !item.loaded && <SpinnerLoading />}
      </div>
      {item.children && item.children.length > 0 && (
        <ul
          className={clsx(
            "ease-ease overflow-hidden pl-0.5 transition-[height] duration-200",
            collapsed && "m-0 h-0"
          )}
        >
          {item.children.map((childItem, index) => (
            <SidebarItem item={childItem} key={index} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default SidebarItem
