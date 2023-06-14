import {
  AdminDraftOrdersDeleteRes,
  AdminDraftOrdersRes,
  AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  AdminPostDraftOrdersDraftOrderLineItemsReq,
  AdminPostDraftOrdersDraftOrderRegisterPaymentRes,
  AdminPostDraftOrdersDraftOrderReq,
  AdminPostDraftOrdersReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminDraftOrderKeys } from "./queries"

export const useAdminCreateDraftOrder = (
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDraftOrdersReq) =>
      client.admin.draftOrders.create(payload),
    buildOptions(queryClient, adminDraftOrderKeys.lists(), options)
  )
}

export const useAdminUpdateDraftOrder = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersDraftOrderReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDraftOrdersDraftOrderReq) =>
      client.admin.draftOrders.update(id, payload),
    buildOptions(
      queryClient,
      [adminDraftOrderKeys.detail(id), adminDraftOrderKeys.lists()],
      options
    )
  )
}

export const useAdminDeleteDraftOrder = (
  id: string,
  options?: UseMutationOptions<Response<AdminDraftOrdersDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.draftOrders.delete(id),
    buildOptions(
      queryClient,
      [adminDraftOrderKeys.detail(id), adminDraftOrderKeys.lists()],
      options
    )
  )
}

export const useAdminDraftOrderRegisterPayment = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPostDraftOrdersDraftOrderRegisterPaymentRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.draftOrders.markPaid(id),
    buildOptions(queryClient, adminDraftOrderKeys.detail(id), options)
  )
}

export const useAdminDraftOrderAddLineItem = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersDraftOrderLineItemsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDraftOrdersDraftOrderLineItemsReq) =>
      client.admin.draftOrders.addLineItem(id, payload),
    buildOptions(queryClient, adminDraftOrderKeys.detail(id), options)
  )
}

export const useAdminDraftOrderRemoveLineItem = (
  id: string,
  options?: UseMutationOptions<Response<AdminDraftOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (itemId: string) => client.admin.draftOrders.removeLineItem(id, itemId),
    buildOptions(queryClient, adminDraftOrderKeys.detail(id), options)
  )
}

export const useAdminDraftOrderUpdateLineItem = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersDraftOrderLineItemsItemReq & { item_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    ({
      item_id,
      ...payload
    }: AdminPostDraftOrdersDraftOrderLineItemsItemReq & { item_id: string }) =>
      client.admin.draftOrders.updateLineItem(id, item_id, payload),
    buildOptions(queryClient, adminDraftOrderKeys.detail(id), options)
  )
}
