import { TQueryKey } from "../../types"

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
    list: (query?: TListQueryType) => [...queryKeyFactory.lists(), { query }],
    details: () => [...queryKeyFactory.all, "detail"],
    detail: (id: TDetailQueryType) => [...queryKeyFactory.details(), id],
  }
  return queryKeyFactory
}
