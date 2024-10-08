export interface SelectParams {
  fields?: string
}

export interface FindParams extends SelectParams {
  limit?: number
  offset?: number
  order?: string
}

export interface AdminBatchLink {
  add?: string[]
  remove?: string[]
}
