import {
  AdminOrdersRes,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderClaimsClaimReq,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
  AdminPostOrdersOrderClaimsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "../products"
import { adminVariantKeys } from "../variants"
import { adminOrderKeys } from "./../orders/queries"

export const useAdminCreateClaim = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderClaimsReq) =>
      client.admin.orders.createClaim(orderId, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminUpdateClaim = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsClaimReq & { claim_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminPostOrdersOrderClaimsClaimReq & { claim_id: string }) =>
      client.admin.orders.updateClaim(orderId, claim_id, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminCancelClaim = (
  orderId: string,
  options?: UseMutationOptions<Response<AdminOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (claimId: string) => client.admin.orders.cancelClaim(orderId, claimId),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminFulfillClaim = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsClaimFulfillmentsReq & { claim_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminPostOrdersOrderClaimsClaimFulfillmentsReq & { claim_id: string }) =>
      client.admin.orders.fulfillClaim(orderId, claim_id, payload),
    buildOptions(
      queryClient,
      [
        adminOrderKeys.detail(orderId),
        adminVariantKeys.all,
        adminProductKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminCancelClaimFulfillment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    { claim_id: string; fulfillment_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      fulfillment_id,
    }: {
      claim_id: string
      fulfillment_id: string
    }) =>
      client.admin.orders.cancelClaimFulfillment(
        orderId,
        claim_id,
        fulfillment_id
      ),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}

export const useAdminCreateClaimShipment = (
  orderId: string,
  options?: UseMutationOptions<
    Response<AdminOrdersRes>,
    Error,
    AdminPostOrdersOrderClaimsClaimShipmentsReq & { claim_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({
      claim_id,
      ...payload
    }: AdminPostOrdersOrderClaimsClaimShipmentsReq & { claim_id: string }) =>
      client.admin.orders.createClaimShipment(orderId, claim_id, payload),
    buildOptions(queryClient, adminOrderKeys.detail(orderId), options)
  )
}
