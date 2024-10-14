import { MenuItem } from "./menu.js"

export type NavigationItemDropdown = {
  type: "dropdown"
  title: string
  children: (MenuItem & {
    useAsFallback?: boolean
  })[]
  project?: string
}

export type NavigationItemLink = {
  type: "link"
  path: string
  title: string
  project?: string
  useAsFallback?: boolean
}

export type NavigationItem = NavigationItemLink | NavigationItemDropdown
