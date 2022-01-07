import { useQueryClient } from "react-query"
import { useGlobalConfig } from "../.."
import { Config, OptionsBuilder, UseOptionsFactory } from "../../types"

export const useOptionsFactory: UseOptionsFactory = (
  options = {},
  { updateQueryKey, invalidationQueryKey },
  config
) => {
  const queryClient = useQueryClient()
  let { shouldInvalidate, shouldUpdate } = useConfig(config)

  if (options?.onSuccess || options?.onSettled || options?.onMutate) {
    return options
  }

  if (shouldInvalidate) {
    options = invalidateOnSuccess(queryClient, invalidationQueryKey, options)
  }

  if (shouldUpdate) {
    options = updateOnSuccess(queryClient, updateQueryKey, options)
  }

  return options
}

const useConfig = (config?: Config) => {
  const { globalInvalidation, globalUpdate } = useGlobalConfig()

  return {
    shouldInvalidate: config?.invalidate === false ? false : globalInvalidation,
    shouldUpdate: config?.update === false ? false : globalUpdate,
  }
}

const updateOnSuccess: OptionsBuilder = (queryClient, queryKey, options) => {
  return {
    ...options,
    onSuccess: async (newData, ...args) => {
      if (options?.onSuccess && typeof options.onSuccess === "function") {
        options.onSuccess(newData, ...args)
      }
      await queryClient.cancelQueries(queryKey)

      queryClient.setQueryData(queryKey, newData)
    },
    onSettled: (...args) => {
      if (options?.onSettled && typeof options.onSettled === "function") {
        options.onSettled(...args)
      }

      queryClient.invalidateQueries(queryKey)
    },
  }
}

const invalidateOnSuccess: OptionsBuilder = (
  queryClient,
  queryKey,
  options
) => {
  return {
    ...options,
    onSuccess: (...args) => {
      if (options?.onSuccess) {
        options.onSuccess(...args)
      }

      queryClient.invalidateQueries(queryKey)
    },
  }
}
