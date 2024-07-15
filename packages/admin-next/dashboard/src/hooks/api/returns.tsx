import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"

export const useInitiateReturn = (
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    Error,
    HttpTypes.AdminInitiateReturnRequest
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminInitiateReturnRequest) =>
      sdk.admin.return.initiateRequest(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
