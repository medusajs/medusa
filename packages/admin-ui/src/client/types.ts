import type { ComponentType } from "react"
import { forbiddenRoutes } from "./forbidden-routes"
import { injectionZones } from "./injection-zones"

export type InjectionZone = typeof injectionZones[number]

export type ForbiddenRoute = typeof forbiddenRoutes[number]

export type ValidPageResult = {
  path: string
  hasConfig: boolean
  file: string
}

export type WidgetConfig = {
  zone: InjectionZone
}

export type LinkConfig = {
  label: string
  icon?: ComponentType
}

export type RouteConfig = {
  link?: LinkConfig
  path: string
}

export type WidgetExtension = {
  Component: ComponentType
  config: WidgetConfig
}

export type RouteExtension = {
  Component: ComponentType
  config: RouteConfig
}

export type Extension = WidgetExtension | RouteExtension

export type Widget = {
  origin: string
  Widget: ComponentType
}

export type Route = {
  origin: string
  path: string
  Page: ComponentType
}

export type Link = {
  label: string
  icon?: ComponentType
  path: string
}

export type ExtensionsEntry = {
  identifier: string
  extensions: Extension[]
}
