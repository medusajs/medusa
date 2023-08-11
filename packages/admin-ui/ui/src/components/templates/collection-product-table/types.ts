export type CollectionProductTableItem = {
  id: string
  thumbnail?: string
  title: string
  status: string
  created_at: Date
}

export type AddCollectionProductTableItem = {
  selected: boolean
} & CollectionProductTableItem
