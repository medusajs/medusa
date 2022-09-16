import {
  AdminOrderEditDeleteRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { adminOrderEditsKeys } from "."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"

export const useAdminDeleteOrderEdit = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orderEdits.delete(id),
    buildOptions(
      queryClient,
      [adminOrderEditsKeys.detail(id), adminOrderEditsKeys.lists()],
      options
    )
  )
}
