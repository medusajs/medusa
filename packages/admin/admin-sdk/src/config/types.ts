import type { InjectionZone } from "@medusajs/admin-shared"
import type { ComponentType } from "react"

export type WidgetConfig = {
  zone: InjectionZone | InjectionZone[]
}

export type RouteConfig = {
  label?: string
  icon?: ComponentType
}
