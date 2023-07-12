import IconChevronRightMini from "@/components/Icons/ChevronRightMini"
import MethodLabel from "@/components/MethodLabel"
import { SidebarItemType, useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

type SidebarItemProps = {
  item: SidebarItemType
} & React.AllHTMLAttributes<HTMLLIElement>

const SidebarItem = ({ item, className }: SidebarItemProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const { isItemActive, setActivePath } = useSidebar()
  const active = isItemActive(item)
  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (active && !inView) {
      // scroll to element
      entry?.target.scrollIntoView()
    }
  }, [active])

  return (
    <li className={clsx("text-label-small-plus", className)} ref={ref}>
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
          {item.method && <MethodLabel method={item.method} />}
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
