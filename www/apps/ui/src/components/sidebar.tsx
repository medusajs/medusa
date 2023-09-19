"use client"

import { Badge, clx } from "@medusajs/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "@/types/nav"
import { ScrollArea } from "./scroll-area"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function Sidebar({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return (
    <aside className="border-ui-border-base lg:w-ref-sidebar relative hidden h-full w-full border-r lg:block">
      {items.length ? (
        <div className="sticky inset-x-0 bottom-0 top-[56px] h-screen max-h-[calc(100vh-56px)] w-full">
          <ScrollArea>
            <div className="h-full w-full p-6">
              {items.map((item, index) => (
                <div key={index} className={clx("pb-6")}>
                  <h4 className="text-ui-fg-muted mb-0.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase leading-5">
                    {item.title}
                  </h4>
                  <SidebarNavItems items={item.items} pathname={pathname} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </aside>
  )
}

interface SidebarItemsProps {
  items?: SidebarNavItem[]
  pathname: string | null
}

export function SidebarNavItems({ items, pathname }: SidebarItemsProps) {
  return items?.length ? (
    <ul className="txt-compact-small-plus grid grid-flow-row auto-rows-max gap-0.5">
      {items.map((item, index) => {
        return (
          <li key={index}>
            {item.href && !item.disabled ? (
              <Link
                href={item.href}
                className={clx(
                  "bg-ui-bg-base text-ui-fg-muted group flex w-full items-center justify-between rounded-md border border-transparent px-3 py-1.5 transition-all",
                  "hover:bg-ui-bg-base-hover text-ui-fg-subtle",
                  item.disabled &&
                    "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed",
                  {
                    "bg-ui-bg-base-pressed text-ui-fg-base border-ui-border-base":
                      pathname === item.href,
                  }
                )}
                target={item.external ? "_blank" : ""}
                rel={item.external ? "noreferrer" : ""}
              >
                {item.title}
                {item.label && <Badge size="small">{item.label}</Badge>}
              </Link>
            ) : (
              <span
                className={clx(
                  "text-ui-fg-muted flex w-full items-center justify-between rounded-md px-3 py-1.5",
                  item.disabled && "text-ui-fg-disabled"
                )}
              >
                {item.title}
                {item.label && <Badge size="small">{item.label}</Badge>}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  ) : null
}
