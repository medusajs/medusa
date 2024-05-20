export interface SelectParams {
  fields?: string[]
}

export interface FindParams extends SelectParams {
  limit?: number
  offset?: number
  order?: string
}
