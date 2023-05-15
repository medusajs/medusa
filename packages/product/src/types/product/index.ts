export interface ProductListFilter {
  id?: string | string[]
  tags?: string[]
}

export interface ProductTagListFilter {
  id?: string | string[]
  value?: string
}

export interface ProductCollectionListFilter {
  id?: string | string[]
  title?: string
}
