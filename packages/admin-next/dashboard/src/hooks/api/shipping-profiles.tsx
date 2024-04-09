import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { CreateShippingProfileReq } from "../../types/api-payloads"
import { ShippingProfileRes } from "../../types/api-responses"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"

const SHIPPING_PROFILE_QUERY_KEY = "shipping_profile" as const
export const shippingProfileQueryKeys = queryKeysFactory(
  SHIPPING_PROFILE_QUERY_KEY
)

export const useCreateShippingProfile = (
  options?: UseMutationOptions<
    ShippingProfileRes,
    Error,
    CreateShippingProfileReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.shippingProfiles.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: shippingProfileQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
