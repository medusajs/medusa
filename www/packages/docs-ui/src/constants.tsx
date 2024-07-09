import React from "react"
import { Badge, NavbarItem } from "@/components"
import { OptionType } from "./hooks"
import { SidebarItemType } from "types"

export const GITHUB_ISSUES_PREFIX = `https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml`
export const GITHUB_UI_ISSUES_PREFIX = `https://github.com/medusajs/ui/issues/new?labels=documentation`

export const navbarItemsV1: NavbarItem[] = [
  {
    type: "link",
    props: {
      label: "Docs",
      target: "_blank",
      rel: "noreferrer",
      href: `/`,
    },
  },
  {
    type: "link",
    props: {
      label: "User Guide",
      target: "_blank",
      rel: "noreferrer",
      href: `/user-guide`,
    },
  },
  {
    type: "link",
    props: {
      label: "Store API",
      target: "_blank",
      rel: "noreferrer",
      href: `/api/store`,
    },
  },
  {
    type: "link",
    props: {
      label: "Admin API",
      target: "_blank",
      rel: "noreferrer",
      href: `/api/admin`,
    },
  },
  {
    type: "link",
    props: {
      label: "UI",
      target: "_blank",
      rel: "noreferrer",
      href: `/ui`,
    },
  },
  {
    type: "divider",
  },
  {
    type: "link",
    props: {
      label: "Learn Medusa v2",
      target: "_blank",
      rel: "noreferrer",
      href: `/v2`,
      badge: {
        variant: "blue",
        children: "New",
      },
    },
  },
]

export const navbarItemsV2: NavbarItem[] = [
  {
    type: "link",
    props: {
      label: "Docs",
      target: "_blank",
      rel: "noreferrer",
      href: `/v2`,
    },
  },
  {
    type: "link",
    props: {
      label: "Learning Resources",
      target: "_blank",
      rel: "noreferrer",
      href: `/v2/resources`,
    },
  },
  {
    type: "link",
    props: {
      label: "Store API",
      target: "_blank",
      rel: "noreferrer",
      href: `/v2/api/store`,
    },
  },
  {
    type: "link",
    props: {
      label: "Admin API",
      target: "_blank",
      rel: "noreferrer",
      href: `/v2/api/admin`,
    },
  },
  {
    type: "link",
    props: {
      label: "UI",
      target: "_blank",
      rel: "noreferrer",
      href: `/ui`,
    },
  },
  {
    type: "divider",
  },
  {
    type: "link",
    props: {
      label: "Medusa v1",
      target: "_blank",
      rel: "noreferrer",
      href: `/`,
    },
  },
]

export const mobileSidebarItemsV1: SidebarItemType[] = [
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
  {
    title: "Learn Medusa V2",
    path: `/v2`,
    loaded: true,
    isPathHref: true,
    additionalElms: <Badge variant="blue">v2</Badge>,
  },
]

export const mobileSidebarItemsV2: SidebarItemType[] = [
  {
    title: "Docs",
    path: `/v2`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Learning Resources",
    path: `/v2/resources`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Store API",
    path: `/v2/api/store`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Admin API",
    path: `/v2/api/admin`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "UI",
    path: `/ui`,
    loaded: true,
    isPathHref: true,
  },
  {
    title: "Medusa v1",
    path: `/`,
    loaded: true,
    isPathHref: true,
  },
]

export const searchFiltersV2: OptionType[] = [
  {
    value: "book",
    label: "Docs v2",
  },
  {
    value: "resources",
    label: "Learning Resources",
  },
  {
    value: "admin-v2",
    label: "Admin API (v2)",
  },
  {
    value: "store-v2",
    label: "Store API (v2)",
  },
  // TODO add more filters
]

export const searchFiltersV1: OptionType[] = [
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
