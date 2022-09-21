import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { adminOrderEditsKeys } from "."

export const useAdminCreateOrderEdit = (
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostOrderEditsReq) =>
      client.admin.orderEdits.create(payload),
    buildOptions(queryClient, adminOrderEditsKeys.lists(), options)
  )
}

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

export const useAdminDeleteOrderEditItemChange = (
  orderEditId: string,
  itemChangeId: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditItemChangeDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orderEdits.deleteItemChange(orderEditId, itemChangeId),
    buildOptions(
      queryClient,
      [adminOrderEditsKeys.detail(orderEditId), adminOrderEditsKeys.lists()],
      options
    )
  )
}

export const useAdminUpdateOrderEdit = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsOrderEditReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrderEditsOrderEditReq) =>
      client.admin.orderEdits.update(id, payload),
    buildOptions(
      queryClient,
      [adminOrderEditsKeys.lists(), adminOrderEditsKeys.detail(id)],
      options
    )
  )
}

export const useAdminRequestOrderEditConfirmation = (
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.orderEdits.requestConfirmation(id),
    buildOptions(
      queryClient,
      [adminOrderEditsKeys.lists(), adminOrderEditsKeys.detail(id)],
      options
    )
  )
}
