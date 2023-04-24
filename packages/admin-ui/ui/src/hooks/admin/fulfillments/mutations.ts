import { AdminPostOrdersOrderFulfillmentsReq } from "@medusajs/medusa"
import { adminOrderKeys } from "medusa-react"
import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"

export interface CreateShipEngineFulfillmentRequest
  extends AdminPostOrdersOrderFulfillmentsReq {
  rate_id: string
}

export const useAdminCreateManualFulfillment = (orderId: string) => {
  const path = `/admin/orders/${orderId}/fulfillments/manual`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostOrdersOrderFulfillmentsReq) =>
      medusaRequest("POST", path, payload),
    buildOptions(queryClient, [
      adminOrderKeys.lists(),
      adminOrderKeys.detail(orderId),
    ])
  )
}

export const useAdminCreateShipEngineFulfillment = (orderId: string) => {
  const path = `/admin/orders/${orderId}/fulfillments/shipengine`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: CreateShipEngineFulfillmentRequest) =>
      medusaRequest("POST", path, payload),
    buildOptions(queryClient, [
      adminOrderKeys.lists(),
      adminOrderKeys.detail(orderId),
    ])
  )
}
