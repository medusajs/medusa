import { NavbarLinkProps } from "@/components"
import { OptionType } from "./hooks"
import { SidebarItemType } from "types"

export const GITHUB_ISSUES_PREFIX = `https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml`
export const GITHUB_UI_ISSUES_PREFIX = `https://github.com/medusajs/ui/issues/new?labels=documentation`

export const navbarItems: NavbarLinkProps[] = [
  {
    label: "Docs",
    target: "_blank",
    rel: "noreferrer",
    href: `/`,
  },
  {
    label: "Resources",
    target: "_blank",
    rel: "noreferrer",
    href: `/resources`,
  },
  {
    label: "User Guide",
    target: "_blank",
    rel: "noreferrer",
    href: `/user-guide`,
  },
  {
    label: "Store API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/store`,
  },
  {
    label: "Admin API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/admin`,
  },
  {
    label: "UI",
    target: "_blank",
    rel: "noreferrer",
    href: `/ui`,
  },
]

/** 
 * TODO Uncomment for V2
 * 
 * export const navbarItems: NavbarLinkProps[] = [
  {
    label: "Docs",
    target: "_blank",
    rel: "noreferrer",
    href: `/`,
    activeValuePattern: /^\/(?!api\/|ui\/|user-guide\/|resources\/)/,
  },
  {
    label: "User Guide",
    target: "_blank",
    rel: "noreferrer",
    href: `/user-guide`,
  },
  {
    label: "Store API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/store`,
  },
  {
    label: "Admin API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/admin`,
  },
  {
    label: "UI",
    target: "_blank",
    rel: "noreferrer",
    href: `/ui`,
    activeValuePattern: /^\/ui\//,
  },
  {
    label: "V2 Docs",
    target: "_blank",
    rel: "noreferrer",
    href: `/v2`,
  },
]

export const navbarItemsV2: NavbarLinkProps[] = [
  {
    label: "Docs",
    target: "_blank",
    rel: "noreferrer",
    href: `/v2`,
    activeValuePattern: /^\/v2\/(?!api\/|ui\/|user-guide\/|resources\/)/,
  },
  {
    label: "Resources",
    target: "_blank",
    rel: "noreferrer",
    href: `/v2/resources`,
    activeValuePattern: /^\/v2\/resources\//,
  },
  {
    label: "User Guide",
    target: "_blank",
    rel: "noreferrer",
    href: `/v2/user-guide`,
    activeValuePattern: /^\/v2\/user-guide/,
  },
  {
    label: "Store API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/store`,
  },
  {
    label: "Admin API",
    target: "_blank",
    rel: "noreferrer",
    href: `/api/admin`,
  },
  {
    label: "UI",
    target: "_blank",
    rel: "noreferrer",
    href: `/ui`,
    activeValuePattern: /^\/ui\//,
  },
]
 */

export const mobileSidebarItems: SidebarItemType[] = [
  {
    title: "Docs",
    path: `/`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "User Guide",
    path: `/user-guide`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Store API",
    path: `/api/store`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Admin API",
    path: `/api/admin`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "UI",
    path: `/ui`,
    loaded: true,
    isPathHref: true,
  },
]

// TODO add resources once we create index
export const searchFilters: OptionType[] = [
  {
    value: "admin",
    label: "Admin API",
  },
  {
    value: "store",
    label: "Store API",
  },
  {
    value: "docs",
    label: "Docs",
  },
  {
    value: "user-guide",
    label: "User Guide",
  },
  {
    value: "plugins",
    label: "Plugins",
  },
  {
    value: "reference",
    label: "References",
  },
  {
    value: "ui",
    label: "UI",
  },
]
