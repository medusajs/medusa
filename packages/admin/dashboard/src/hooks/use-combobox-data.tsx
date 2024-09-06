import {
  QueryKey,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { useDebouncedSearch } from "./use-debounced-search"

type ComboboxExternalData = {
  offset: number
  limit: number
  count: number
}

type ComboboxQueryParams = {
  q?: string
  offset?: number
  limit?: number
}

export const useComboboxData = <
  TResponse extends ComboboxExternalData,
  TParams extends ComboboxQueryParams
>({
  queryKey,
  queryFn,
  getOptions,
  defaultValue,
  defaultValueKey,
  pageSize = 10,
}: {
  queryKey: QueryKey
  queryFn: (params: TParams) => Promise<TResponse>
  getOptions: (data: TResponse) => { label: string; value: string }[]
  defaultValueKey?: keyof TParams
  defaultValue?: string | string[]
  pageSize?: number
}) => {
  const { searchValue, onSearchValueChange, query } = useDebouncedSearch()

  const queryInitialDataBy = defaultValueKey || "id"
  const { data: initialData } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return queryFn({
        [queryInitialDataBy]: defaultValue,
        limit: Array.isArray(defaultValue) ? defaultValue.length : 1,
      } as TParams)
    },
    enabled: !!defaultValue,
  })

  const { data, ...rest } = useInfiniteQuery({
    queryKey: [...queryKey, query],
    queryFn: async ({ pageParam = 0 }) => {
      return await queryFn({
        q: query,
        limit: pageSize,
        offset: pageParam,
      } as TParams)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const moreItemsExist = lastPage.count > lastPage.offset + lastPage.limit
      return moreItemsExist ? lastPage.offset + lastPage.limit : undefined
    },
    placeholderData: keepPreviousData,
  })

  const options = data?.pages.flatMap((page) => getOptions(page)) ?? []
  const defaultOptions = initialData ? getOptions(initialData) : []

  /**
   * If there are no options and the query is empty, then the combobox should be disabled,
   * as there is no data to search for.
   */
  const disabled = !rest.isPending && !options.length && !searchValue

  // // make sure that the default value is included in the option, if its not in options already
  if (
    defaultValue &&
    defaultOptions.length &&
    !options.find((o) => o.value === defaultValue)
  ) {
    options.unshift(defaultOptions[0])
  }

  return {
    options,
    searchValue,
    onSearchValueChange,
    disabled,
    ...rest,
  }
}
