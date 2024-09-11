// Product
export const PRODUCT_ENTRYPOINT = "product" as const

export type ProductForms = {
  create: {
    tabs: ["general", "organize"]
  }
  edit: {}
  organize: {}
  attributes: {}
}

export const PRODUCT_FORM_IDS = [
  "create",
  "edit",
  "organize",
  "attributes",
] as const

export const FORM_ENTRYPOINTS = [PRODUCT_ENTRYPOINT] as const
export const FORM_IDS = [...PRODUCT_FORM_IDS] as const
