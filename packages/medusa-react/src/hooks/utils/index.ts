import * as React from "react"

type TQueryKey<TKey, TListQuery = any, TDetailQuery = string> = {
  all: [TKey]
  lists: () => [...TQueryKey<TKey>["all"], "list"]
  list: (
    query?: TListQuery
  ) => [
    ...ReturnType<TQueryKey<TKey>["lists"]>,
    { query: TListQuery | undefined }
  ]
  details: () => [...TQueryKey<TKey>["all"], "detail"]
  detail: (
    id: TDetailQuery
  ) => [...ReturnType<TQueryKey<TKey>["details"]>, TDetailQuery]
}

export const makeKeysFactory = <
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

export const useLocalStorage = (key: string, initialState: string) => {
  const [item, setItem] = React.useState(() => {
    try {
      const item =
        typeof window !== "undefined" && window.localStorage.getItem(key)

      return item || initialState
    } catch (err) {
      return initialState
    }
  })

  const save = (data: string) => {
    setItem(data)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, data)
    }
  }

  const remove = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key)
    }
  }

  return [item, save, remove] as const
}
