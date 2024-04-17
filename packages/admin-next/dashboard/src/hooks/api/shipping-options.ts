import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import {
  ShippingOptionDeleteRes,
  ShippingOptionRes,
} from "../../types/api-responses"
import { CreateShippingOptionReq } from "../../types/api-payloads"
import { stockLocationsQueryKeys } from "./stock-locations"
import { queryClient } from "../../lib/medusa"
import { client } from "../../lib/client"

export const useCreateShippingOptions = (
  options?: UseMutationOptions<
    ShippingOptionRes,
    Error,
    CreateShippingOptionReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.shippingOptions.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteShippingOption = (
  optionId: string,
  options?: UseMutationOptions<ShippingOptionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.shippingOptions.delete(optionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
