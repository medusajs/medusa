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

type OrderOutput =
  | OrderDTO[]
  | {
      rows: OrderDTO[]
      metadata: any
    }

export const getOrdersListlWorkflowId = "get-orders-list"
export const getOrdersListlWorkflow = createWorkflow(
  getOrdersListlWorkflowId,
  (
    input: WorkflowData<{
      fields: string[]
      variables?: Record<string, any>
    }>
  ): WorkflowData<OrderOutput> => {
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

    const orders: OrderDTO[] = useRemoteQueryStep({
      entry_point: "orders",
      fields,
      variables: input.variables,
      list: true,
    })

    const aggregatedOrders = transform(
      { orders, input },
      ({ orders, input }) => {
        const fields = input.fields
        const requiredPaymentFields = fields.some((f) =>
          f.includes("payment_collections")
        )
        const requiredFulfillmentFields = fields.some((f) =>
          f.includes("fulfillments")
        )

        const orders_ = orders as any
        const data = orders_.rows ? orders_.rows : orders_

        for (const order of data) {
          const order_ = order as OrderDetailDTO

          order_.payment_status = getLastPaymentStatus(
            order_
          ) as OrderDetailDTO["payment_status"]
          order_.fulfillment_status = getLastFulfillmentStatus(
            order_
          ) as OrderDetailDTO["fulfillment_status"]

          if (!requiredPaymentFields) {
            // @ts-ignore
            delete order_.payment_collections
          }
          if (!requiredFulfillmentFields) {
            // @ts-ignore
            delete order_.fulfillments
          }
        }

        return orders
      }
    )

    return aggregatedOrders
  }
)
