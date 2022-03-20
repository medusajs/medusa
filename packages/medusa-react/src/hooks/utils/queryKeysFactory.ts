import { TQueryKey } from "../../types"

export const queryKeysFactory = <
  T,
  TListQueryType = any,
  TDetailQueryType = string,
  TCollectionType = string,
  TCollectionQueryType = string
>(
  globalKey: T
) => {
  const queryKeyFactory: TQueryKey<
    T,
    TListQueryType,
    TDetailQueryType,
    TCollectionType,
    TCollectionQueryType
  > = {
    all: [globalKey],
    lists: () => [...queryKeyFactory.all, "list"],
    list: (query?: TListQueryType) => [...queryKeyFactory.lists(), { query }],
    details: () => [...queryKeyFactory.all, "detail"],
    detail: (id: TDetailQueryType) => [...queryKeyFactory.details(), id],
    sublist: (
      id: TDetailQueryType,
      collection: TCollectionType,
      query?: TCollectionQueryType
    ) => [...queryKeyFactory.detail(id), collection, { query }],
  }
  return queryKeyFactory
}
