import { MenuItem } from "./menu.js"

export type NavigationItemDropdown = {
  type: "dropdown"
  title: string
  children: (MenuItem & {
    sidebar_id?: string
  })[]
  link?: string
  sidebar_id?: string
}

export type NavigationItemLink = {
  type: "link"
  link: string
  title: string
  sidebar_id?: string
}

export type NavigationItem = NavigationItemLink | NavigationItemDropdown
