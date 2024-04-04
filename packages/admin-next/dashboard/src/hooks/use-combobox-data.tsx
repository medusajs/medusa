import { QueryKey, useInfiniteQuery } from "@tanstack/react-query"
import debounce from "lodash/debounce"
import { useCallback, useEffect, useState } from "react"

type Params = {
  q: string
  limit: number
  offset: number
}

type Page = {
  count: number
  offset: number
  limit: number
}

type UseComboboxDataProps<TParams extends Params, TRes extends Page> = {
  fetcher: (params: TParams) => Promise<TRes>
  params?: Omit<TParams, "q" | "limit" | "offset">
  queryKey: QueryKey
}

/**
 * Hook for fetching infinite data for a combobox.
 */
export const useComboboxData = <TParams extends Params, TRes extends Page>({
  fetcher,
  params,
  queryKey,
}: UseComboboxDataProps<TParams, TRes>) => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((query) => setDebouncedQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedUpdate(query)

    return () => debouncedUpdate.cancel()
  }, [query, debouncedUpdate])

  const data = useInfiniteQuery(
    [...queryKey, debouncedQuery],
    async ({ pageParam = 0 }) => {
      const res = await fetcher({
        q: debouncedQuery,
        limit: 10,
        offset: pageParam,
        ...params,
      } as TParams)
      return res
    },
    {
      getNextPageParam: (lastPage) => {
        const morePages = lastPage.count > lastPage.offset + lastPage.limit
        return morePages ? lastPage.offset + lastPage.limit : undefined
      },
      keepPreviousData: true,
    }
  )

  return {
    ...data,
    query,
    setQuery,
  }
}
