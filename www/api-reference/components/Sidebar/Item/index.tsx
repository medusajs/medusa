import type IconProps from "@/components/Icons/types"
import type { SidebarItemType } from "@/providers/sidebar"
import { useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import SpinnerLoading from "@/components/Loading/Spinner"
import type { MethodLabelProps } from "../../MethodLabel"

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
  const { isItemActive, setActivePath } = useSidebar()
  const active = isItemActive(item)
  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (active && !inView) {
      // scroll to element
      entry?.target.scrollIntoView()
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
          href={`#${item.path}`}
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
          }}
        >
          {item.method && (
            <MethodLabel method={item.method} className="h-fit !py-0" />
          )}
          <span>{item.title}</span>
        </Link>
        {item.children && (
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
      {item.children && (
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
