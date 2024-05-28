import { OrderDTO, OrderDetailDTO } from "@medusajs/types"
import { deduplicate } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"

enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_CAPTURED = "partially_captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export const getOrderDetailWorkflowId = "get-order-detail"
export const getOrderDetailWorkflow = createWorkflow(
  getOrderDetailWorkflowId,
  (
    input: WorkflowData<{ fields: string[]; order_id: string }>
  ): WorkflowData<OrderDetailDTO> => {
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
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const aggregatedOrder = transform({ order }, ({ order }) => {
      const order_ = order as OrderDetailDTO

      const getLastPaymentStatus = (order) => {
        let paymentStatus = {}
        for (const status in PaymentStatus) {
          paymentStatus[PaymentStatus[status]] = 0
        }

        const totalPayments = order.payment_collections.length

        for (const paymentCollection of order.payment_collections) {
          paymentStatus[paymentCollection.status] += 1
        }

        if (paymentStatus[PaymentStatus.REQUIRES_ACTION] > 0) {
          return PaymentStatus.REQUIRES_ACTION
        }

        if (paymentStatus[PaymentStatus.REFUNDED] > 0) {
          if (paymentStatus[PaymentStatus.REFUNDED] === totalPayments) {
            return PaymentStatus.REFUNDED
          } else {
            return PaymentStatus.PARTIALLY_REFUNDED
          }
        }

        if (paymentStatus[PaymentStatus.CAPTURED] > 0) {
          if (paymentStatus[PaymentStatus.CAPTURED] === totalPayments) {
            return PaymentStatus.CAPTURED
          } else {
            return PaymentStatus.PARTIALLY_CAPTURED
          }
        }

        if (paymentStatus[PaymentStatus.AWAITING] > 0) {
          return PaymentStatus.AWAITING
        }
        return PaymentStatus.NOT_PAID
      }

      const getLastFulfillmentStatus = (order) => {
        let fulfillmentStatus = {}
        for (const status in FulfillmentStatus) {
          fulfillmentStatus[FulfillmentStatus[status]] = 0
        }

        const totalFulfillments = order.fulfillments.length

        for (const fulfillmentCollection of order.fulfillments) {
          fulfillmentStatus[fulfillmentCollection.status] += 1
        }

        if (fulfillmentStatus[FulfillmentStatus.REQUIRES_ACTION] > 0) {
          return FulfillmentStatus.REQUIRES_ACTION
        }

        if (fulfillmentStatus[FulfillmentStatus.RETURNED] > 0) {
          if (
            fulfillmentStatus[FulfillmentStatus.RETURNED] === totalFulfillments
          ) {
            return FulfillmentStatus.RETURNED
          } else {
            return FulfillmentStatus.PARTIALLY_RETURNED
          }
        }

        if (fulfillmentStatus[FulfillmentStatus.SHIPPED] > 0) {
          if (
            fulfillmentStatus[FulfillmentStatus.SHIPPED] === totalFulfillments
          ) {
            return FulfillmentStatus.SHIPPED
          } else {
            return FulfillmentStatus.PARTIALLY_SHIPPED
          }
        }

        if (fulfillmentStatus[FulfillmentStatus.FULFILLED] > 0) {
          if (
            fulfillmentStatus[FulfillmentStatus.FULFILLED] === totalFulfillments
          ) {
            return FulfillmentStatus.FULFILLED
          } else {
            return FulfillmentStatus.PARTIALLY_FULFILLED
          }
        }

        if (fulfillmentStatus[FulfillmentStatus.CANCELED] > 0) {
          return FulfillmentStatus.CANCELED
        }

        return FulfillmentStatus.NOT_FULFILLED
      }

      order_.payment_status = getLastPaymentStatus(order)
      order_.fulfillment_status = getLastFulfillmentStatus(order)
      return order_
    })

    return aggregatedOrder
  }
)
