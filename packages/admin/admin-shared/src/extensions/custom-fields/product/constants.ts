export const PRODUCT_CUSTOM_FIELD_MODEL = "product" as const

export const PRODUCT_CUSTOM_FIELD_FORM_ZONES = [
  "create",
  "edit",
  "organize",
  "attributes",
] as const

export const PRODUCT_CUSTOM_FIELD_CREATE_FORM_TABS = [
  "general",
  "organize",
] as const
export const PRODUCT_CUSTOM_FIELD_FORM_TABS = [
  ...PRODUCT_CUSTOM_FIELD_CREATE_FORM_TABS,
] as const

export const PRODUCT_CUSTOM_FIELD_DISPLAY_ZONES = [
  "general",
  "organize",
  "attributes",
] as const

export const PRODUCT_CUSTOM_FIELD_LINK_PATHS = [
  `${PRODUCT_CUSTOM_FIELD_MODEL}.$link`,
] as const

export const PRODUCT_CUSTOM_FIELD_FORM_CONFIG_PATHS = [
  ...PRODUCT_CUSTOM_FIELD_FORM_ZONES.map(
    (form) => `${PRODUCT_CUSTOM_FIELD_MODEL}.${form}.$config`
  ),
] as const

export const PRODUCT_CUSTOM_FIELD_FORM_FIELD_PATHS = [
  ...PRODUCT_CUSTOM_FIELD_FORM_ZONES.flatMap((form) => {
    return form === "create"
      ? PRODUCT_CUSTOM_FIELD_CREATE_FORM_TABS.map(
          (tab) => `${PRODUCT_CUSTOM_FIELD_MODEL}.${form}.${tab}.$field`
        )
      : [`${PRODUCT_CUSTOM_FIELD_MODEL}.${form}.$field`]
  }),
] as const

export const PRODUCT_CUSTOM_FIELD_DISPLAY_PATHS = [
  ...PRODUCT_CUSTOM_FIELD_DISPLAY_ZONES.map(
    (id) => `${PRODUCT_CUSTOM_FIELD_MODEL}.${id}.$display`
  ),
] as const
