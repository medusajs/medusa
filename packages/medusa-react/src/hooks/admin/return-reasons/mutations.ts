import {
  AdminPostReturnReasonsReasonReq,
  AdminPostReturnReasonsReq,
  AdminReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminReturnReasonKeys } from "./queries"

export const useAdminCreateReturnReason = (
  options?: UseMutationOptions<
    Response<AdminReturnReasonsRes>,
    Error,
    AdminPostReturnReasonsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostReturnReasonsReq) =>
      client.admin.returnReasons.create(payload),
    buildOptions(queryClient, adminReturnReasonKeys.lists(), options)
  )
}

export const useAdminUpdateReturnReason = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminReturnReasonsRes>,
    Error,
    AdminPostReturnReasonsReasonReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostReturnReasonsReasonReq) =>
      client.admin.returnReasons.update(id, payload),
    buildOptions(
      queryClient,
      [adminReturnReasonKeys.detail(id), adminReturnReasonKeys.lists()],
      options
    )
  )
}

export const useAdminDeleteReturnReason = (
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.returnReasons.delete(id),
    buildOptions(
      queryClient,
      [adminReturnReasonKeys.detail(id), adminReturnReasonKeys.lists()],
      options
    )
  )
}
