import type { ComponentType } from "react"
import { forbiddenRoutes } from "../constants/forbidden-routes"
import { injectionZones } from "../constants/injection-zones"

export type InjectionZone = (typeof injectionZones)[number]

export type ForbiddenRoute = (typeof forbiddenRoutes)[number]

export type WidgetConfig = {
  zone: InjectionZone | InjectionZone[]
}

export type LinkConfig = {
  label: string
  icon?: ComponentType
}

export type RouteConfig = {
  link?: LinkConfig
}

export type GeneratedRouteConfig = {
  link?: LinkConfig
  path: string
}

export type WidgetExtension = {
  Component: ComponentType
  config: WidgetConfig
}

export type RouteExtension = {
  Component: ComponentType
  config: GeneratedRouteConfig
}

export type Extension = WidgetExtension | RouteExtension

export type Widget = {
  origin: string
  Widget: ComponentType<any>
}

export type RouteSegment = {
  path: string
}

export type Route = {
  origin: string
  path: string
  Page: ComponentType<any>
}

export type Link = {
  label: string
  icon?: ComponentType<any>
  path: string
}

export type ExtensionsEntry = {
  identifier: string
  extensions: Extension[]
}

export interface WidgetProps {
  notify: {
    success: (title: string, message: string) => void
    error: (title: string, message: string) => void
    warn: (title: string, message: string) => void
    info: (title: string, message: string) => void
  }
}
