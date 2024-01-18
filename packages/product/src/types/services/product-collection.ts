import { ProductTypes } from "@medusajs/types"

export type ProductCollectionEventData = {
  id: string
}

export enum ProductCollectionEvents {
  COLLECTION_UPDATED = "product-collection.updated",
  COLLECTION_CREATED = "product-collection.created",
  COLLECTION_DELETED = "product-collection.deleted",
}

export type UpdateProductCollection =
  ProductTypes.UpdateProductCollectionDTO & {
    products?: string[]
  }

export type CreateProductCollection =
  ProductTypes.CreateProductCollectionDTO & {
    products?: string[]
  }
