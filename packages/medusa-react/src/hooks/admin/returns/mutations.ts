import {
  AdminPostReturnsReturnReceiveReq,
  AdminReturnsCancelRes,
  AdminReturnsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminReturnKeys } from "./queries"

export const useAdminReceiveReturn = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminReturnsRes>,
    Error,
    AdminPostReturnsReturnReceiveReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload) => client.admin.returns.receive(id, payload),
    buildOptions(
      queryClient,
      [adminReturnKeys.detail(id), adminReturnKeys.list()],
      options
    )
  )
}

export const useAdminCancelReturn = (
  id: string,
  options?: UseMutationOptions<Response<AdminReturnsCancelRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.returns.cancel(id),
    buildOptions(
      queryClient,
      [adminReturnKeys.detail(id), adminReturnKeys.list()],
      options
    )
  )
}
