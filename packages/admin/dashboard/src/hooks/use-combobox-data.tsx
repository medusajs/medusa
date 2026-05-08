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
  id?: string
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
  selectedValue,
  pageSize = 10,
  enabled = true,
}: {
  queryKey: QueryKey
  queryFn: (params: TParams) => Promise<TResponse>
  getOptions: (data: TResponse) => { label: string; value: string }[]
  defaultValueKey?: keyof TParams
  defaultValue?: string | string[]
  selectedValue?: string
  pageSize?: number
  enabled?: boolean
}) => {
  const { searchValue, onSearchValueChange, query } = useDebouncedSearch()

  const queryInitialDataBy = defaultValueKey || "id"
  const { data: initialData } = useQuery({
    queryKey: [...queryKey, defaultValue].filter(Boolean) as QueryKey,
    queryFn: async () => {
      return queryFn({
        [queryInitialDataBy]: defaultValue,
        limit: Array.isArray(defaultValue) ? defaultValue.length : 1,
      } as TParams)
    },
    enabled: !!defaultValue && enabled,
  })

  // always load selected value in case current data dosn't contain the value
  const { data: selectedData } = useQuery({
    queryKey: [...queryKey, selectedValue].filter(Boolean) as QueryKey,
    queryFn: async () => {
      return queryFn({
        id: selectedValue,
        limit: 1,
      } as TParams)
    },
    enabled: !!selectedValue && enabled,
  })

  const { data, ...rest } = useInfiniteQuery({
    // prevent infinite query response shape beeing stored under regualr list reponse QKs
    queryKey: [...queryKey, "_cbx_", query].filter(Boolean) as QueryKey,
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
    enabled: enabled,
  })

  const options = data?.pages.flatMap((page) => getOptions(page)) ?? []
  const defaultOptions = initialData ? getOptions(initialData) : []
  const selectedOptions = selectedData ? getOptions(selectedData) : []
  /**
   * If there are no options and the query is empty, then the combobox should be disabled,
   * as there is no data to search for.
   */
  const disabled =
    (!rest.isPending && !options.length && !searchValue) || !enabled

  // make sure that the default value is included in the options
  if (defaultValue && defaultOptions.length && !searchValue) {
    defaultOptions.forEach((option) => {
      if (!options.find((o) => o.value === option.value)) {
        options.unshift(option)
      }
    })
  }

  if (selectedValue && selectedOptions.length) {
    selectedOptions.forEach((option) => {
      if (!options.find((o) => o.value === option.value)) {
        options.unshift(option)
      }
    })
  }

  return {
    options,
    searchValue,
    onSearchValueChange,
    disabled,
    ...rest,
  }
}
