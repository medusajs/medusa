import type { ComponentType } from "react"
import { extensionTypes, injectionZones } from "./constants"

export type InjectionZone = typeof injectionZones[number]

export type ExtensionType = typeof extensionTypes[number]

export type WidgetConfig = {
  type: "widget"
  zone: InjectionZone
}

export type PageConfig = {
  type: "page"
  path: string
  title: string
}

export type WidgetExtension = {
  Component: React.ComponentType<any>
  config: WidgetConfig
}

export type PageExtension = {
  Component: React.ComponentType<any>
  config: PageConfig
}

export type Extension = WidgetExtension | PageExtension

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

export type Link = Pick<PageConfig, "path" | "title">
