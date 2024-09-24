import { InjectionZone } from "@medusajs/admin-shared"
import { ComponentType, createContext } from "react"
import { NavItemProps } from "../../components/layout/nav-item"
import { MenuItemPath } from "../../medusa-app"

type ExtensionsContextValue = {
  api: {
    getWidgets: (zone: InjectionZone) => ComponentType[]
    getMenuItems: (path: MenuItemPath) => NavItemProps[]
  }
}

export const ExtensionsContext = createContext<ExtensionsContextValue | null>(
  null
)
