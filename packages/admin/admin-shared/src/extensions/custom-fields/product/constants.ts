export const ProductEntrypoint = "product" as const

export const ProductFormIds = [
  "create",
  "edit",
  "organize",
  "attributes",
] as const

export const ProductCreateTabs = ["general", "organize"] as const

export const ProductFormPaths = [
  ...ProductFormIds.flatMap((formId) => {
    return formId === "create"
      ? ProductCreateTabs.map((tab) => `${ProductEntrypoint}.${formId}.${tab}`)
      : [`${ProductEntrypoint}.${formId}`]
  }),
] as const

export const ProductContainerIds = [
  "general",
  "organize",
  "attributes",
] as const

export const ProductContainerPaths = [
  ...ProductContainerIds.map((id) => `${ProductEntrypoint}.${id}`),
] as const
