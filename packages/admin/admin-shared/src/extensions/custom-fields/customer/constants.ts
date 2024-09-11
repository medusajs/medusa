export const CustomerEntrypoint = "customer" as const

export const CustomerFormIds = ["create", "edit"] as const

export const CustomerContainerIds = ["general"] as const

export const CustomerFormPaths = [
  ...CustomerFormIds.map((id) => `${CustomerEntrypoint}.${id}`),
] as const

export const CustomerContainerPaths = [
  ...CustomerContainerIds.map((id) => `${CustomerEntrypoint}.${id}`),
] as const
