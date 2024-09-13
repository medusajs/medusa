import {
  CUSTOMER_CUSTOM_FIELD_DISPLAY_ZONES,
  CUSTOMER_CUSTOM_FIELD_FORM_ZONES,
} from "./constants"

export type CustomerFormZone = (typeof CUSTOMER_CUSTOM_FIELD_FORM_ZONES)[number]
export type CustomerDisplayZone =
  (typeof CUSTOMER_CUSTOM_FIELD_DISPLAY_ZONES)[number]
