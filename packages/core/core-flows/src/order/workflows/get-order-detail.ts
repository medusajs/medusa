import { OrderDTO, OrderDetailDTO } from "@medusajs/framework/types"
import { deduplicate } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../utils/aggregate-status"

export const getOrderDetailWorkflowId = "get-order-detail"
/**
 * This workflow retrieves an order's details.
 */
export const getOrderDetailWorkflow = createWorkflow(
  getOrderDetailWorkflowId,
  (
    input: WorkflowData<{
      fields: string[]
      order_id: string
      version?: number
    }>
  ): WorkflowResponse<OrderDetailDTO> => {
    const fields = transform(input, ({ fields }) => {
      return deduplicate([
        ...fields,
        "id",
        "status",
        "version",
        "payment_collections.*",
        "fulfillments.*",
      ])
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields,
      variables: {
        id: input.order_id,
        version: input.version,
      },
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

    return new WorkflowResponse(aggregatedOrder)
  }
)
