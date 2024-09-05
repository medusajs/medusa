export type LinkMethodRequest = {
  add?: string[]
  remove?: string[]
}

export type LinkWorkflowInput = {
  id: string
  add?: string[]
  remove?: string[]
}

export type BatchMethodRequest<TCreate, TUpdate, TDelete = string> = {
  create?: TCreate[]
  update?: TUpdate[]
  delete?: TDelete[]
}

export type BatchMethodResponse<T> = {
  created: T[]
  updated: T[]
  deleted: string[]
}

export type BatchWorkflowInput<
  TCreate,
  TUpdate,
  TDelete = string
> = BatchMethodRequest<TCreate, TUpdate, TDelete>

export type BatchWorkflowOutput<T> = BatchMethodResponse<T>
