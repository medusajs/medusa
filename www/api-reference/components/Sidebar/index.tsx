"use client"

import { useSidebar } from "@/providers/sidebar"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { SidebarItemProps } from "./Item"
import Loading from "../Loading"
import IconXMark from "../Icons/XMark"

const SidebarItem = dynamic<SidebarItemProps>(async () => import("./Item"), {
  loading: () => <Loading count={1} />,
}) as React.FC<SidebarItemProps>

type SidebarProps = {
  className?: string
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const { items, mobileSidebarOpen, desktopSidebarOpen, setMobileSidebarOpen } =
    useSidebar()

  return (
    <aside
      className={clsx(
        "clip bg-docs-bg dark:bg-docs-bg-dark w-api-ref-sidebar block",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-r border-solid",
        "fixed -left-full top-[57px] h-screen transition-[left] lg:relative lg:left-0 lg:top-auto lg:h-auto",
        "lg:w-sidebar w-full md:w-auto",
        mobileSidebarOpen && "!left-0",
        !desktopSidebarOpen && "!absolute !-left-full",
        className
      )}
      style={{
        animationFillMode: "forwards",
      }}
    >
      <div className="flex justify-end p-1 lg:hidden">
        <button
          className="btn-clear"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <IconXMark />
        </button>
      </div>
      <ul
        className={clsx(
          "sticky top-[57px] h-screen max-h-screen w-full list-none overflow-auto p-0",
          "px-1.5 pb-[57px] pt-1.5"
        )}
        id="sidebar"
      >
        <div className="mb-1.5 lg:hidden">
          {!items.mobile.length && <Loading className="px-0" />}
          {items.mobile.map((item, index) => (
            <SidebarItem item={item} key={index} />
          ))}
        </div>
        <div className="mb-1.5">
          {!items.top.length && <Loading className="px-0" />}
          {items.top.map((item, index) => (
            <SidebarItem item={item} key={index} />
          ))}
        </div>
        <div className="mb-1.5">
          {!items.bottom.length && <Loading className="px-0" />}
          {items.bottom.map((item, index) => (
            <SidebarItem item={item} key={index} />
          ))}
        </div>
      </ul>
    </aside>
  )
}

export default Sidebar
