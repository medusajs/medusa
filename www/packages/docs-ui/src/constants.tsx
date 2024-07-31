import React from "react"
import { Badge, NavbarItem, HelpButton } from "@/components"
import { OptionType } from "@/hooks"
import { NavigationDropdownItem, SidebarItem } from "types"
import { NotificationItemType } from "@/providers"
import { NavigationDropdownDocIcon } from "./components/Icons/NavigationDropdown/Doc"
import { NavigationDropdownStoreIcon } from "./components/Icons/NavigationDropdown/Store"
import { NavigationDropdownAdminIcon } from "./components/Icons/NavigationDropdown/Admin"
import { NavigationDropdownUiIcon } from "./components/Icons/NavigationDropdown/Ui"
import { NavigationDropdownResourcesIcon } from "./components/Icons/NavigationDropdown/Resources"

export const GITHUB_ISSUES_PREFIX = `https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml`
export const GITHUB_UI_ISSUES_PREFIX = `https://github.com/medusajs/ui/issues/new?labels=documentation`

export const navDropdownItemsV2: NavigationDropdownItem[] = [
  {
    type: "link",
    path: `/v2`,
    icon: NavigationDropdownDocIcon,
    title: "Documentation",
  },
  {
    type: "link",
    path: `/v2/resources`,
    // TODO use user guide icon
    icon: NavigationDropdownResourcesIcon,
    title: "Learning Resources",
  },
  {
    type: "link",
    path: `/v2/api/store`,
    icon: NavigationDropdownStoreIcon,
    title: "Store API",
  },
  {
    type: "link",
    path: `/v2/api/admin`,
    icon: NavigationDropdownAdminIcon,
    title: "Admin API",
  },
  {
    type: "link",
    path: `/ui`,
    icon: NavigationDropdownUiIcon,
    title: "UI",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    path: `/`,
    // TODO use docs icon
    icon: NavigationDropdownDocIcon,
    title: "Medusa v1",
  },
]

export const navDropdownItemsV1: NavigationDropdownItem[] = [
  {
    type: "link",
    path: `/`,
    icon: NavigationDropdownDocIcon,
    title: "Documentation",
  },
  {
    type: "link",
    path: `/user-guide`,
    // TODO use user guide icon
    icon: NavigationDropdownDocIcon,
    title: "User Guide",
  },
  {
    type: "link",
    path: `/api/store`,
    icon: NavigationDropdownStoreIcon,
    title: "Store API",
  },
  {
    type: "link",
    path: `/api/admin`,
    icon: NavigationDropdownAdminIcon,
    title: "Admin API",
  },
  {
    type: "link",
    path: `/ui`,
    icon: NavigationDropdownUiIcon,
    title: "UI",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    path: `/v2`,
    // TODO use docs icon
    icon: NavigationDropdownDocIcon,
    title: "Medusa v2",
  },
]

// TODO remove navbarItems in favor of navbar dropdown items
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

export const mobileSidebarItemsV1: SidebarItem[] = [
  {
    type: "link",
    title: "Docs",
    path: `/`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "User Guide",
    path: `/user-guide`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Store API",
    path: `/api/store`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Admin API",
    path: `/api/admin`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "UI",
    path: `/ui`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Learn Medusa V2",
    path: `/v2`,
    loaded: true,
    isPathHref: true,
    additionalElms: <Badge variant="blue">v2</Badge>,
  },
]

export const mobileSidebarItemsV2: SidebarItem[] = [
  {
    type: "link",
    title: "Docs",
    path: `/v2`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Learning Resources",
    path: `/v2/resources`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Store API",
    path: `/v2/api/store`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "Admin API",
    path: `/v2/api/admin`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
    title: "UI",
    path: `/ui`,
    loaded: true,
    isPathHref: true,
  },
  {
    type: "link",
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

export const helpButtonNotification: NotificationItemType = {
  layout: "empty",
  children: <HelpButton />,
}
