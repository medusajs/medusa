import { MenuItem, MenuItemSubMenu } from "./menu.js"

export type NavigationMenuItem =
  | (Exclude<MenuItem, MenuItemSubMenu> & {
      sidebar_id?: string
    })
  | (Omit<MenuItemSubMenu, "items"> & {
      sidebar_id?: string
      items: NavigationMenuItem[]
    })

export type NavigationItemDropdown = {
  type: "dropdown"
  title: string
  children: NavigationMenuItem[]
  link?: string
  additional_links?: string[]
  sidebar_id?: string
}

export type NavigationItemLink = {
  type: "link"
  link: string
  additional_links?: string[]
  title: string
  sidebar_id?: string
}

export type NavigationItem = NavigationItemLink | NavigationItemDropdown
