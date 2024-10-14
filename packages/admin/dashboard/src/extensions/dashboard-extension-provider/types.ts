import { InjectionZone } from "@medusajs/admin-shared"
import { ComponentType } from "react"
import { LoaderFunction } from "react-router-dom"
import { CustomFieldConfiguration } from "../../extensions/custom-field-registry/types"

export type RouteExtension = {
  Component: ComponentType
  loader?: LoaderFunction
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
  customFields?: CustomFieldConfiguration
  menuItems?: MenuItemExtension[]
  widgets?: WidgetExtension[]
}
