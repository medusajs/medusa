import {
  PRODUCT_CUSTOM_FIELD_DISPLAY_ZONES,
  PRODUCT_CUSTOM_FIELD_FORM_TABS,
  PRODUCT_CUSTOM_FIELD_FORM_ZONES,
} from "./constants"

export type ProductFormZone = (typeof PRODUCT_CUSTOM_FIELD_FORM_ZONES)[number]
export type ProductFormTab = (typeof PRODUCT_CUSTOM_FIELD_FORM_TABS)[number]
export type ProductDisplayZone =
  (typeof PRODUCT_CUSTOM_FIELD_DISPLAY_ZONES)[number]
