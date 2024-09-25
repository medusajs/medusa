import { InjectionZone } from "@medusajs/admin-shared"
import { ComponentType, createContext } from "react"
import { NavItemProps } from "../../components/layout/nav-item"
import { MenuItemPath } from "../../medusa-app"

type MedusaAppContextValue = {
  api: {
    getWidgets: (zone: InjectionZone) => ComponentType[]
    getMenu: (path: MenuItemPath) => NavItemProps[]
  }
}

export const MedusaAppContext = createContext<MedusaAppContextValue | null>(
  null
)
