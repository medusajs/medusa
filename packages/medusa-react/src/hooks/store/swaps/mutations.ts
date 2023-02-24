import { StorePostSwapsReq, StoreSwapsRes } from "@medusajs/client-types"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"

export const useCreateSwap = (
  options?: UseMutationOptions<StoreSwapsRes, Error, StorePostSwapsReq>
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostSwapsReq) => client.swaps.create(data),
    options
  )
}
