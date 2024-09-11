import {
  CustomerContainerConfig,
  CustomerEntrypoint,
  CustomerFormConfig,
} from "./customer"
import {
  ProductContainerConfig,
  ProductCreateTabs,
  ProductEntrypoint,
  ProductFormConfig,
} from "./product"

const entrypoint = [ProductEntrypoint, CustomerEntrypoint] as const
export type Entrypoint = (typeof entrypoint)[number]

export interface EntrypointFormMap {
  product: ProductFormConfig
  customer: CustomerFormConfig
}

export interface EntrypointContainerMap {
  product: ProductContainerConfig
  customer: CustomerContainerConfig
}

export type EntrypointFormTabsMap = {
  product: {
    create: (typeof ProductCreateTabs)[number]
    edit: never
    organize: never
    attributes: never
  }
  customer: {
    create: never
    edit: never
  }
}

export type FormKeys<T extends Entrypoint> = EntrypointFormMap[T]
