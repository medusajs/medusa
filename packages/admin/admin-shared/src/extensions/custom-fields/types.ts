import {
  CUSTOM_FIELD_CONTAINER_ZONES,
  CUSTOM_FIELD_FORM_TABS,
  CUSTOM_FIELD_FORM_ZONES,
  CUSTOM_FIELD_MODELS,
} from "./constants"
import type {
  ProductDisplayZone,
  ProductFormTab,
  ProductFormZone,
} from "./product"

export type CustomFieldModel = (typeof CUSTOM_FIELD_MODELS)[number]

export type CustomFieldFormZone = (typeof CUSTOM_FIELD_FORM_ZONES)[number]

export type CustomFieldFormTab = (typeof CUSTOM_FIELD_FORM_TABS)[number]

export type CustomFieldContainerZone =
  (typeof CUSTOM_FIELD_CONTAINER_ZONES)[number]

export type CustomFieldZone = CustomFieldFormZone | CustomFieldContainerZone

export type CustomFieldImportType = "display" | "field" | "link" | "config"

export interface CustomFieldModelFormMap {
  product: ProductFormZone
}

export interface CustomFieldModelContainerMap {
  product: ProductDisplayZone
}

export type CustomFieldModelFormTabsMap = {
  product: {
    create: ProductFormTab
    edit: never
    organize: never
    attributes: never
  }
  customer: {
    create: never
    edit: never
  }
}

export type CustomFieldFormKeys<T extends CustomFieldModel> =
  CustomFieldModelFormMap[T]
