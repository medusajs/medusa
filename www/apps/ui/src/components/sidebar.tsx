"use client"

import { Badge, clx } from "@medusajs/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "@/types/nav"
import { ScrollArea } from "./scroll-area"
import clsx from "clsx"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function Sidebar({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        "border-medusa-border-base dark:border-medusa-border-base-dark",
        "lg:w-ref-sidebar relative hidden h-full w-full border-r lg:block"
      )}
    >
      {items.length ? (
        <div className="sticky inset-x-0 bottom-0 top-[56px] h-screen max-h-[calc(100vh-56px)] w-full">
          <ScrollArea>
            <div className="h-full w-full p-6">
              {items.map((item, index) => (
                <div key={index} className={clx("pb-6")}>
                  <h4
                    className={clsx(
                      "text-medusa-fg-muted dark:text-medusa-fg-muted-dark",
                      "mb-0.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase leading-5"
                    )}
                  >
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
                  "bg-docs-bg text-medusa-fg-muted group flex w-full items-center justify-between rounded-md border border-transparent px-3 py-1.5 transition-all",
                  "dark:bg-docs-bg-dark dark:text-medusa-fg-muted-dark",
                  "hover:bg-medusa-bg-base-hover text-medusa-fg-subtle",
                  "dark:hover:bg-medusa-bg-base-hover-dark dark:text-medusa-fg-subtle-dark",
                  item.disabled && [
                    "bg-medusa-bg-base-disabled text-medusa-fg-disabled cursor-not-allowed",
                    "dark:bg-medusa-bg-base-disabled-dark dark:text-medusa-fg-disabled cursor-not-allowed-dark",
                  ],
                  pathname === item.href && [
                    "bg-medusa-bg-base-pressed text-medusa-fg-base border-medusa-border-base",
                    "dark:bg-medusa-bg-base-pressed-dark dark:text-medusa-fg-base-dark dark:border-medusa-border-base-dark",
                  ]
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
                  "text-medusa-fg-muted dark:text-medusa-fg-muted-dark flex w-full items-center justify-between rounded-md px-3 py-1.5",
                  item.disabled &&
                    "text-medusa-fg-disabled dark:text-medusa-fg-disabled-dark"
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
