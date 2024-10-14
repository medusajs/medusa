import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
  InjectionZone,
} from "@medusajs/admin-shared"
import { ComponentType } from "react"
import { LoaderFunction } from "react-router-dom"
import { ZodFirstPartySchemaTypes } from "zod"

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

export type DisplayExtension = {
  Component: ComponentType<{ data: any }>
  zone: CustomFieldContainerZone
}

export type FormFieldExtension = {
  validation: ZodFirstPartySchemaTypes
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
  validation: ZodFirstPartySchemaTypes
}

export type ConfigExtension = {
  zone: CustomFieldFormZone
  fields: Record<string, ConfigFieldExtension>
}

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
