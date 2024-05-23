import type { ComponentType } from "react"

import { InjectionZone } from "../widgets"

export type WidgetConfig = {
  zone: InjectionZone | InjectionZone[]
}

export type RouteConfig = {
  label?: string
  icon?: ComponentType
}
