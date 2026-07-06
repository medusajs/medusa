export type TQueryKey<TKey, TListQuery = any, TDetailQuery = string> = {
  all: readonly [TKey]
  lists: () => readonly [...TQueryKey<TKey>["all"], "list"]
  list: (query?: TListQuery) => readonly (string | TKey | { query: TListQuery })[]
  details: () => readonly [...TQueryKey<TKey>["all"], "detail"]
  detail: (
    id: TDetailQuery,
    query?: TListQuery
  ) => readonly (string | TKey | TDetailQuery | { query: TListQuery })[]
}

export const queryKeysFactory = <
  T,
  TListQueryType = any,
  TDetailQueryType = string
>(
  globalKey: T
) => {
  const queryKeyFactory: TQueryKey<T, TListQueryType, TDetailQueryType> = {
    all: [globalKey],
    lists: () => [...queryKeyFactory.all, "list"],
    list: (query?: TListQueryType) =>
      query !== undefined
        ? [...queryKeyFactory.lists(), { query }]
        : queryKeyFactory.lists(),
    details: () => [...queryKeyFactory.all, "detail"],
    detail: (id: TDetailQueryType, query?: TListQueryType) =>
      query !== undefined
        ? [...queryKeyFactory.details(), id, { query }]
        : [...queryKeyFactory.details(), id],
  }
  return queryKeyFactory
}
