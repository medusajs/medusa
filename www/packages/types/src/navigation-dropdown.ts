import { IconProps } from "@medusajs/icons/dist/types.js"

export type NavigationDropdownItemLink = {
  path: string
  isActive?: boolean
  title: string
  icon: React.FC<IconProps>
}

export type NavigationDropdownItem =
  | ({
      type: "link"
    } & NavigationDropdownItemLink)
  | {
      type: "divider"
    }

export type BreadcrumbOptions = {
  showCategories?: boolean
}
