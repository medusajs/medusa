export type ProductCollectionEventData = {
  id: string
}

export enum ProductCollectionEvents {
  COLLECTION_UPDATED = "product-collection.updated",
  COLLECTION_CREATED = "product-collection.created",
  COLLECTION_DELETED = "product-collection.deleted",
}
