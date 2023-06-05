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
  const { activeItem, changeActiveItem } = useSidebar()

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
            activeItem?.path === item.path &&
              "text-medusa-text-base dark:text-medusa-text-base-dark",
            activeItem?.path !== item.path &&
              "text-medusa-text-subtle dark:text-medusa-text-subtle"
          )}
          scroll={true}
          onClick={() => changeActiveItem(item.path)}
        >
          {item.method && (
            <span
              className={clsx(
                "text-medusa-text-on-color text-label-x-small mr-0.5 rounded py-[2px] px-[4px] text-[10px]",
                item.method === "get" &&
                  "bg-medusa-tag-green-icon dark:bg-medusa-tag-green-icon-dark",
                item.method === "post" &&
                  "bg-medusa-tag-blue-icon dark:bg-medusa-tag-blue-icon-dark",
                item.method === "delete" &&
                  "bg-medusa-tag-red-icon dark:bg-medusa-tag-red-icon-dark"
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
                activeItem?.path === item.path &&
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
