"use client"

import { BloomIcon, MainNavProvider as UiMainNavProvider } from "docs-ui"
import { config } from "../config"
import { MenuItem, NavigationItem, NavigationItemDropdown } from "types"

type MainNavProviderProps = {
  children?: React.ReactNode
}

export const MainNavProvider = ({ children }: MainNavProviderProps) => {
  const navigationItems: NavigationItem[] = [
    {
      type: "link",
      title: "Getting Started",
      link: "/",
      sidebar_id: "getting-started",
    },
    {
      type: "link",
      title: "Features",
      link: `/features/commerce-features`,
      sidebar_id: "features",
    },
    {
      type: "link",
      title: "Prompting",
      link: `/prompting/store-design-prompting`,
      sidebar_id: "prompting",
    },
    {
      type: "link",
      title: "Developers",
      link: `/developers/code-editor`,
      sidebar_id: "developers",
    },
    // {
    //   type: "link",
    //   title: "Changelog",
    //   link: `#`,
    // },
  ]

  const helpNavItem: NavigationItemDropdown = {
    type: "dropdown",
    title: "Help",
    children: [
      {
        type: "link",
        title: "Contact Support",
        link: "/help-and-feedback#contact-support",
      },
      {
        type: "link",
        title: "FAQ",
        link: "/faq",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Discord Community",
        link: "https://discord.gg/medusajs",
      },
    ],
  }

  const additionalMenuItems: MenuItem[] = [
    {
      type: "link",
      title: "Homepage",
      link: "https://bloom.medusajs.com",
    },
  ]

  return (
    <UiMainNavProvider
      navItems={navigationItems}
      logo={<BloomIcon className="text-medusa-fg-subtle" />}
      helpNavItem={helpNavItem}
      additionalMenuItems={additionalMenuItems}
      logoUrl={`${config.baseUrl}${config.basePath}`}
    >
      {children}
    </UiMainNavProvider>
  )
}
