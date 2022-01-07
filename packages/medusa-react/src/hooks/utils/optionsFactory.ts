import { useQueryClient } from "react-query"
import { useGlobalConfig } from "../.."
import { OptionsBuilder, UseOptionsFactory } from "../../types"

export const useOptionsFactory: UseOptionsFactory = (
  options = {},
  { updateQueryKey, invalidationQueryKey },
  config?: any
) => {
  const {
    automaticAdminInvalidation: globalAutomaticInvalidation,
    automaticAdminUpdate: globalAutomaticUpdate,
  } = useGlobalConfig()
  config.invalidate =
    config.invalidate === false ? false : globalAutomaticInvalidation
  config.update = config.update === false ? false : globalAutomaticUpdate

  const queryClient = useQueryClient()

  console.log(config)
  if (options?.onSuccess || options?.onSettled || options?.onMutate) {
    return options
  }

  if (config?.invalidate) {
    options = invalidateOnSuccess(queryClient, invalidationQueryKey, options)
  }

  if (config?.update) {
    options = updateOnSuccess(queryClient, updateQueryKey, options)
  }

  return options
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
