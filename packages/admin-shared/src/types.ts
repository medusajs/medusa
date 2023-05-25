import type { ComponentType } from "react"
import type { NavigateFunction } from "react-router-dom"
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
  icon?: ComponentType
}

export type ExtensionConfig = WidgetConfig | PageConfig

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

export type Link = Pick<PageConfig, "path" | "title" | "icon">

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
