import { InjectionZone } from "@medusajs/admin-shared"
import { LoaderFunctionArgs } from "react-router-dom"

export type RouteExtension = {
  Component: React.ComponentType
  loader?: (args: LoaderFunctionArgs) => Promise<any>
  path: string
}

export type MenuItemExtension = {
  label: string
  path: string
  icon?: React.ComponentType
}

export type WidgetExtension = {
  Component: React.ComponentType
  zone: InjectionZone[]
}

export type RoutingExtensionConfig = {
  routes: RouteExtension[]
  menuItems: MenuItemExtension[]
}

export type DashboardExtensionConfig = {
  routing: RoutingExtensionConfig
  widgets: WidgetExtension[]
}
