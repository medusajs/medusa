export type LinkMethodRequest = {
  add?: string[]
  remove?: string[]
}

export type LinkWorkflowInput = {
  id: string
  add?: string[]
  remove?: string[]
}

export type BatchMethodRequest<TCreate, TUpdate> = {
  create?: TCreate[]
  update?: TUpdate[]
  delete?: string[]
}

export type BatchMethodResponse<T> = {
  created: T[]
  updated: T[]
  deleted: {
    ids: string[]
    object: string
    deleted: boolean
  }
}

export type BatchWorkflowInput<TCreate, TUpdate> = BatchMethodRequest<
  TCreate,
  TUpdate
>

export type BatchWorkflowOutput<T> = BatchMethodResponse<T>
