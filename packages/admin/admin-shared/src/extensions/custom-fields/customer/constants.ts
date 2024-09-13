export const CUSTOMER_CUSTOM_FIELD_MODEL = "customer" as const

export const CUSTOMER_CUSTOM_FIELD_FORM_ZONES = ["create", "edit"] as const

export const CUSTOMER_CUSTOM_FIELD_DISPLAY_ZONES = ["general"] as const

export const CUSTOMER_CUSTOM_FIELD_LINK_PATHS = [
  `${CUSTOMER_CUSTOM_FIELD_MODEL}.$link`,
] as const

export const CUSTOMER_CUSTOM_FIELD_FORM_CONFIG_PATHS = [
  ...CUSTOMER_CUSTOM_FIELD_FORM_ZONES.map(
    (form) => `${CUSTOMER_CUSTOM_FIELD_MODEL}.${form}.$config`
  ),
] as const

export const CUSTOMER_CUSTOM_FIELD_FORM_FIELD_PATHS = [
  ...CUSTOMER_CUSTOM_FIELD_FORM_ZONES.map(
    (form) => `${CUSTOMER_CUSTOM_FIELD_MODEL}.${form}.$field`
  ),
] as const

export const CUSTOMER_CUSTOM_FIELD_DISPLAY_PATHS = [
  ...CUSTOMER_CUSTOM_FIELD_DISPLAY_ZONES.map(
    (id) => `${CUSTOMER_CUSTOM_FIELD_MODEL}.${id}.$display`
  ),
] as const
