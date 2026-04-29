import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
  InjectionZone,
  NestedRoutePosition,
} from "@medusajs/admin-shared"
import { ComponentType } from "react"
import { LoaderFunction } from "react-router-dom"
import { z } from "zod"
import { INavItem } from "../components/layout/nav-item"

export type RouteExtension = {
  Component: ComponentType
  loader?: LoaderFunction
  handle?: object
  children?: RouteExtension[]
  path: string
}

export type MenuItemExtension = {
  label: string
  path: string
  icon?: ComponentType
  nested?: NestedRoutePosition
  rank?: number
  translationNs?: string
}

export type WidgetExtension = {
  Component: ComponentType
  zone: InjectionZone[]
}

export type DisplayExtension = {
  Component: ComponentType<{ data: any }>
  zone: CustomFieldContainerZone
}

export type FormFieldExtension = {
  validation: z.ZodTypeAny
  Component?: ComponentType<any>
  label?: string
  description?: string
  placeholder?: string
}

export type FormExtension = {
  zone: CustomFieldFormZone
  tab?: CustomFieldFormTab
  fields: Record<string, FormFieldExtension>
}

export type ConfigFieldExtension = {
  defaultValue: ((data: any) => any) | any
  validation: z.ZodTypeAny
}

export type ConfigExtension = {
  zone: CustomFieldFormZone
  fields: Record<string, ConfigFieldExtension>
}

export type I18nExtension = Record<string, Record<string, any>>

export type LinkModule = {
  links: Record<CustomFieldModel, (string | string[])[]>
}

export type DisplayModule = {
  displays: Record<CustomFieldModel, DisplayExtension[]>
}

export type FormModule = {
  customFields: Record<
    CustomFieldModel,
    {
      forms: FormExtension[]
      configs: ConfigExtension[]
    }
  >
}

export type WidgetModule = {
  widgets: WidgetExtension[]
}

export type RouteModule = {
  routes: RouteExtension[]
}

export type MenuItemModule = {
  menuItems: MenuItemExtension[]
}

export type I18nModule = {
  resources: I18nExtension
}

export type MenuItemKey = "coreExtensions" | "settingsExtensions"

export type FormField = FormFieldExtension & {
  name: string
}

export type TabFieldMap = Map<CustomFieldFormTab, FormField[]>

export type ZoneStructure = {
  components: FormField[]
  tabs: TabFieldMap
}

export type FormZoneMap = Map<CustomFieldFormZone, ZoneStructure>

export type FormFieldMap = Map<CustomFieldModel, FormZoneMap>

export type ConfigField = ConfigFieldExtension & {
  name: string
}

export type ConfigFieldMap = Map<
  CustomFieldModel,
  Map<CustomFieldFormZone, ConfigField[]>
>

export type DisplayMap = Map<
  CustomFieldModel,
  Map<CustomFieldContainerZone, React.ComponentType<{ data: any }>[]>
>

export type MenuMap = Map<MenuItemKey, INavItem[]>

export type WidgetMap = Map<InjectionZone, React.ComponentType[]>

export type DashboardPlugin = {
  formModule: FormModule
  displayModule: DisplayModule
  menuItemModule: MenuItemModule
  widgetModule: WidgetModule
  routeModule: RouteModule
  i18nModule?: I18nModule
}
