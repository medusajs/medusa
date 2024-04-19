export type LinkMethodRequest = {
  add?: string[]
  remove?: string[]
}

export type BatchMethodRequest<TCreate extends any, TUpdate extends any> = {
  create?: TCreate[]
  update?: TUpdate[]
  delete?: string[]
}

export type BatchMethodResponse<T extends any> = {
  created: T[]
  updated: T[]
  deleted: {
    ids: string[]
    object: string
    deleted: boolean
  }
}
