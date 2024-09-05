import type { ContainerId, FormId, InjectionZone } from "@medusajs/admin-shared"
import type { ComponentType } from "react"

export type WidgetConfig = {
  zone: InjectionZone | InjectionZone[]
}

export type RouteConfig = {
  label?: string
  icon?: ComponentType
}

type FormField = {
  label: string
  description?: string
}

type FormConfig = {
  /**
   * The form ID or IDs that the custom fields should be injected into.
   */
  form: FormId | FormId[]
  fields: Record<string, FormField>
}

type DetailConfig<TData,> = {
  container: ContainerId
  fields: string
}

export type CustomFieldsConfig<TData,> = {
  base: "product",
  extension: string,
  fields: Record<string, {
    label: string,
    description?: string,
    type: "string" | "int" | "float" | "moneyAmount" | "boolean" | "relation"
  }>
  forms: {
    id: FormId | FormId[]
    header?: string
    subheader?: string
  }[]
}