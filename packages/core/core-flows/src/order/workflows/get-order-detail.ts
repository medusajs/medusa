import { OrderDTO, OrderDetailDTO } from "@medusajs/types"
import { deduplicate } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../utils/aggregate-status"

export const getOrderDetailWorkflowId = "get-order-detail"
export const getOrderDetailWorkflow = createWorkflow(
  getOrderDetailWorkflowId,
  (
    input: WorkflowData<{
      fields: string[]
      order_id: string
    }>
  ): WorkflowData<OrderDetailDTO> => {
    const fields = transform(input, ({ fields }) => {
      return deduplicate([
        ...fields,
        "id",
        "status",
        "version",
        "payment_collections.status",
        "payment_collections.amount",
        "payment_collections.captured_amount",
        "payment_collections.refunded_amount",
        "fulfillments.packed_at",
        "fulfillments.shipped_at",
        "fulfillments.delivered_at",
        "fulfillments.canceled_at",
      ])
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const aggregatedOrder = transform({ order }, ({ order }) => {
      const order_ = order as OrderDetailDTO

      order_.payment_status = getLastPaymentStatus(
        order_
      ) as OrderDetailDTO["payment_status"]
      order_.fulfillment_status = getLastFulfillmentStatus(
        order_
      ) as OrderDetailDTO["fulfillment_status"]
      return order_
    })

    return aggregatedOrder
  }
)
