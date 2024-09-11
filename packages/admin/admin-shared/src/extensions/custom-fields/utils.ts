import { CustomerContainerPaths, CustomerFormPaths } from "./customer"
import { ProductContainerPaths, ProductFormPaths } from "./product"

const VALID_CONTAINER_PATHS = [
  ...ProductContainerPaths,
  ...CustomerContainerPaths,
] as const

export const isValidContainerId = (id: any): id is string => {
  return VALID_CONTAINER_PATHS.includes(id)
}

const VALID_FORM_PATHS = [...ProductFormPaths, ...CustomerFormPaths] as const

export const isValidFormPath = (id: any): id is string => {
  return VALID_FORM_PATHS.includes(id)
}
