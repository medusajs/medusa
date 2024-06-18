import {
  FulfillmentDTO,
  OrderDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
} from "@medusajs/types"
import { MedusaError, deepFlatMap } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { cancelPaymentStep } from "../../payment/steps"
import { deleteReservationsByLineItemsStep } from "../../reservation/steps"
import { cancelOrdersStep } from "../steps/cancel-orders"
import { throwIfOrderIsCancelled } from "../utils/order-validation"

const validateOrder = createStep(
  "validate-order",
  ({
    order,
  }: {
    order: OrderDTO
    input: OrderWorkflow.CancelOrderWorkflowInput
  }) => {
    const order_ = order as OrderDTO & {
      payment_collections: PaymentCollectionDTO[]
      fulfillments: FulfillmentDTO[]
    }

    throwIfOrderIsCancelled({ order })

    let refunds = 0
    let captures = 0

    deepFlatMap(order_, "payment_collections.payments", ({ payments }) => {
      refunds += payments?.refunds?.length ?? 0
      captures += payments?.captures?.length ?? 0
    })

    if (captures > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment capture(s) cannot be canceled"
      )
    }

    if (refunds > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order with payment refund(s) cannot be canceled"
      )
    }

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      type: string
    ) => {
      if (arr?.filter(pred).length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `All ${type} must be canceled before canceling an order`
        )
      }
    }

    const notCanceled = (o) => !o.canceled_at

    throwErrorIf(order_.fulfillments, notCanceled, "fulfillments")
  }
)

export const cancelOrderWorkflowId = "cancel-order"
export const cancelOrderWorkflow = createWorkflow(
  cancelOrderWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelOrderWorkflowInput>
  ): WorkflowData<void> => {
    const order: OrderDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "orders",
        fields: [
          "id",
          "status",
          "items.id",
          "fulfillments.canceled_at",
          "payment_collections.payments.id",
          "payment_collections.payments.refunds.id",
          "payment_collections.payments.captures.id",
        ],
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ order, input })

    const lineItemIds = transform({ order }, ({ order }) => {
      return order.items?.map((i) => i.id)
    })

    const paymentIds = transform({ order }, ({ order }) => {
      return deepFlatMap(
        order,
        "payment_collections.payments",
        ({ payments }) => {
          return payments?.id
        }
      )
    })

    parallelize(
      deleteReservationsByLineItemsStep(lineItemIds),
      cancelPaymentStep({ paymentIds }),
      cancelOrdersStep({ orderIds: [order.id] })
    )
  }
)
