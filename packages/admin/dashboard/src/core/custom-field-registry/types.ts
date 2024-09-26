import type {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
} from "@medusajs/admin-shared"
import type { ComponentType } from "react"
import type { ZodFirstPartySchemaTypes } from "zod"

export type FormField = {
  name: string
  validation: ZodFirstPartySchemaTypes
  label?: string
  description?: string
  Component?: ComponentType
}

export type TabFieldMap = Map<CustomFieldFormTab, FormField[]>

export type ZoneStructure = {
  components: FormField[]
  tabs: TabFieldMap
}

export type FormZoneMap = Map<CustomFieldFormZone, ZoneStructure>

export type ModelFormMap = Map<CustomFieldModel, FormZoneMap>

export type ModelLinkMap = Map<CustomFieldModel, string>

export type FormFieldDefinition = {
  validation: ZodFirstPartySchemaTypes
  label?: string
  description?: string
  Component?: ComponentType
}

export type FormFieldsDefinition = Record<string, FormFieldDefinition>

export type ZoneFormsDefinition = {
  zone: CustomFieldFormZone
  tab?: CustomFieldFormTab
  fields: FormFieldsDefinition
}

export type LinkDefinition = (string | string[])[]

export type FormConfig = {
  name: string
  defaultValue: any | ((data: any) => any)
  validation: ZodFirstPartySchemaTypes
}

export type FormConfigDefinition = {
  validation: ZodFirstPartySchemaTypes
  defaultValue: any | ((data: any) => any)
}

export type FormConfigsDefinition = Record<string, FormConfigDefinition>

export type ZoneConfigDefinition = {
  zone: CustomFieldFormZone
  fields: FormConfigsDefinition
}

export type ModelConfigMap = Map<
  CustomFieldModel,
  Map<CustomFieldFormZone, FormConfig[]>
>

export type DisplayDefinition = {
  zone: CustomFieldContainerZone
  Component: ComponentType<{ data: any }>
}

export type ModelDisplayMap = Map<
  CustomFieldModel,
  Map<CustomFieldContainerZone, ComponentType<{ data: any }>[]>
>

export type ModelCustomization = {
  links: LinkDefinition
  forms: ZoneFormsDefinition[]
  configs: ZoneConfigDefinition[]
  displays: DisplayDefinition[]
}

export type CustomFieldConfiguration = Record<
  CustomFieldModel,
  ModelCustomization
>
