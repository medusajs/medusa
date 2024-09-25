import { InjectionZone } from "@medusajs/admin-shared"
import { ComponentType } from "react"
import { LoaderFunctionArgs } from "react-router-dom"

export type RouteExtension = {
  Component: ComponentType
  loader?: (args: LoaderFunctionArgs) => Promise<any>
  path: string
}

export type MenuItemExtension = {
  label: string
  path: string
  icon?: ComponentType
}

export type WidgetExtension = {
  Component: ComponentType
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
