import { QueryClient, QueryKey, UseMutationOptions } from "react-query"

export const buildOptions = <
  TData,
  TError,
  TVariables,
  TContext,
  TKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey: TKey[] | TKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  return {
    ...options,
    onSuccess: (...args: [TData, TVariables, TContext | undefined]) => {
      if (options?.onSuccess) {
        return options.onSuccess(...args)
      }

      if (Array.isArray(queryKey)) {
        queryKey.forEach((key) => queryClient.invalidateQueries(key))
      } else {
        queryClient.invalidateQueries(queryKey)
      }
    },
  }
}
