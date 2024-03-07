import { ProductTypes } from "@medusajs/types"

export type ProductEventData = {
  id: string
}

export enum ProductEvents {
  PRODUCT_UPDATED = "product.updated",
  PRODUCT_CREATED = "product.created",
  PRODUCT_DELETED = "product.deleted",
}

export type UpdateProductInput = ProductTypes.UpdateProductDTO & {
  id: string
}
