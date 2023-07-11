import IconChevronRightMini from "@/components/Icons/ChevronRightMini"
import { SidebarItemType, useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import Link from "next/link"
import { useState } from "react"

type SidebarItemProps = {
  item: SidebarItemType
} & React.AllHTMLAttributes<HTMLLIElement>

const SidebarItem = ({ item, className }: SidebarItemProps) => {
  const [collapsed, setCollapsed] = useState(false)
  // const { activeItem, changeActiveItem } = useSidebar()
  const { isItemActive, setActivePath } = useSidebar()
  const active = isItemActive(item)

  return (
    <li className={clsx("text-label-small-plus", className)}>
      <div
        className={clsx(
          "group",
          item.children?.length && "flex justify-between pr-0.5"
        )}
      >
        <Link
          href={`#${item.path}`}
          className={clsx(
            "block py-1 px-[20px]",
            "group-hover:text-medusa-text-base dark:group-hover:text-medusa-text-base-dark group-hover:no-underline",
            active && "text-medusa-text-base dark:text-medusa-text-base-dark",
            !active && "text-medusa-text-subtle dark:text-medusa-text-subtle"
          )}
          scroll={true}
          onClick={() => {
            setActivePath(item.path)
          }}
        >
          {item.method && (
            <span
              className={clsx(
                "text-label-x-small mr-0.5 rounded py-[4px] px-0.5 !text-[10px]",
                item.method === "get" &&
                  "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
                item.method === "post" &&
                  "bg-medusa-tag-blue-bg dark:bg-medusa-tag-blue-bg-dark text-medusa-tag-blue-text dark:text-medusa-tag-blue-text-dark",
                item.method === "delete" &&
                  "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
              )}
            >
              {item.method.toUpperCase()}
            </span>
          )}
          {item.title}
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
      </div>
      {item.children && (
        <ul
          className={clsx(
            "ease-ease overflow-hidden pl-0.5 transition-[height] duration-200",
            collapsed && "h-0"
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
