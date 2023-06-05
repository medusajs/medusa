import type { ComponentType } from "react"
import type { NavigateFunction } from "react-router-dom"
import { extensionTypes, injectionZones } from "./constants"

export type InjectionZone = typeof injectionZones[number]

export type ExtensionType = typeof extensionTypes[number]

export type WidgetConfig = {
  type: "widget"
  zone: InjectionZone | InjectionZone[]
}

export type RouteConfig = {
  type: "route"
  path: string
  title: string
  icon?: ComponentType
}

export type NestedRouteConfig = {
  type: "nested-route"
  path: string
  parent: string
}

export type ExtensionConfig = WidgetConfig | RouteConfig | NestedRouteConfig

export type WidgetExtension = {
  Component: React.ComponentType<any>
  config: WidgetConfig
}

export type RouteExtension = {
  Component: React.ComponentType<any>
  config: RouteConfig
}

export type NestedRouteExtension = {
  Component: React.ComponentType<any>
  config: NestedRouteConfig
}

export type Extension = WidgetExtension | RouteExtension | NestedRouteExtension

export type ExtensionsEntry = {
  identifier: string
  extensions: Extension[]
}

export type Widget = {
  origin: string
  Widget: ComponentType<any>
}

export type Route = {
  origin: string
  path: string
  Page: ComponentType<any>
}

export type NestedRoute = {
  origin: string
  parent: string
  path: string
  Page: ComponentType<any>
}

export type Link = Pick<RouteConfig, "path" | "title" | "icon">

type Notify = {
  success: (title: string, message: string) => void
  error: (title: string, message: string) => void
  info: (title: string, message: string) => void
  warning: (title: string, message: string) => void
}

export interface ExtensionProps {
  navigate: NavigateFunction
  notify: Notify
}
