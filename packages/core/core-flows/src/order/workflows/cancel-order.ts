import {
  FulfillmentDTO,
  OrderDTO,
  OrderWorkflow,
  PaymentCollectionDTO,
} from "@medusajs/framework/types"
import {
  deepFlatMap,
  MathBN,
  MedusaError,
  OrderWorkflowEvents,
  PaymentCollectionStatus,
} from "@medusajs/framework/utils"
import {
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useQueryGraphStep } from "../../common"
import { updatePaymentCollectionStep } from "../../payment-collection"
import { cancelPaymentStep } from "../../payment/steps"
import { deleteReservationsByLineItemsStep } from "../../reservation/steps"
import { cancelOrdersStep } from "../steps/cancel-orders"
import { throwIfOrderIsCancelled } from "../utils/order-validation"
import { createOrderRefundCreditLinesWorkflow } from "./payments/create-order-refund-credit-lines"
import { refundCapturedPaymentsWorkflow } from "./payments/refund-captured-payments"

/**
 * The data to validate the order's cancelation.
 */
export type CancelValidateOrderStepInput = {
  /**
   * The order to cancel.
   */
  order: OrderDTO
  /**
   * The cancelation details.
   */
  input: OrderWorkflow.CancelOrderWorkflowInput
}

/**
 * This step validates that an order can be canceled. If the order has fulfillments that
 * aren't canceled, or the order was canceled previously, the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = cancelValidateOrder({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 */
export const cancelValidateOrder = createStep(
  "cancel-validate-order",
  ({ order }: CancelValidateOrderStepInput) => {
    const order_ = order as OrderDTO & {
      payment_collections: PaymentCollectionDTO[]
      fulfillments: FulfillmentDTO[]
    }

    throwIfOrderIsCancelled({ order })

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      type: string
    ) => {
      if (arr?.some(pred)) {
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
/**
 * This workflow cancels an order. An order can only be canceled if it doesn't have
 * any fulfillments, or if all fulfillments are canceled. The workflow will also cancel
 * any uncaptured payments, and refund any captured payments.
 *
 * This workflow is used by the [Cancel Order Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidcancel).
 *
 * This workflow has a hook that allows you to perform custom actions on the canceled order. For example, you can
 * make changes to custom models linked to the order.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around canceling an order.
 *
 * @example
 * const { result } = await cancelOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Cancel an order.
 *
 * @property hooks.orderCanceled - This hook is executed after the order is canceled. You can consume this hook to perform custom actions on the canceled order.
 */
export const cancelOrderWorkflow = createWorkflow(
  cancelOrderWorkflowId,
  (input: WorkflowData<OrderWorkflow.CancelOrderWorkflowInput>) => {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "status",
        "items.id",
        "fulfillments.canceled_at",
        "payment_collections.payments.id",
        "payment_collections.payments.amount",
        "payment_collections.payments.refunds.id",
        "payment_collections.payments.refunds.amount",
        "payment_collections.payments.captures.id",
        "payment_collections.payments.captures.amount",
        "payment_collections.payments.captures.raw_amount",
      ],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    cancelValidateOrder({ order, input })

    const uncapturedPaymentIds = transform({ order }, ({ order }) => {
      const payments = deepFlatMap(
        order,
        "payment_collections.payments",
        ({ payments }) => payments
      )

      const uncapturedPayments = payments.filter(
        (payment) => payment.captures.length === 0
      )

      return uncapturedPayments.map((payment) => payment.id)
    })

    const lineItemIds = transform({ order }, ({ order }) => {
      return order.items?.map((i) => i.id)
    })

    const [refundedPayments] = parallelize(
      refundCapturedPaymentsWorkflow.runAsStep({
        input: { order_id: order.id, created_by: input.canceled_by },
      }),
      deleteReservationsByLineItemsStep(lineItemIds),
      cancelPaymentStep({ paymentIds: uncapturedPaymentIds }),
      emitEventStep({
        eventName: OrderWorkflowEvents.CANCELED,
        data: { id: order.id },
      })
    )

    const refundedPaymentIds = transform(
      { refundedPayments },
      ({ refundedPayments }) => {
        return refundedPayments.map((payment) => payment.id)
      }
    )

    const refundedCapturesQuery = useQueryGraphStep({
      entity: "captures",
      fields: ["raw_amount"],
      filters: { payment_id: refundedPaymentIds },
    }).config({ name: "get-refunded-captures" })

    const creditLineAmount = transform(
      { refundedCapturesQuery },
      ({ refundedCapturesQuery }) => {
        const captures = refundedCapturesQuery.data
        return captures.reduce(
          (acc, capture) => MathBN.sum(acc, capture.raw_amount),
          MathBN.convert(0)
        )
      }
    )

    createOrderRefundCreditLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        amount: creditLineAmount,
      },
    })

    const paymentCollectionids = transform({ order }, ({ order }) =>
      order.payment_collections?.map((pc) => pc.id)
    )

    when({ paymentCollectionids }, ({ paymentCollectionids }) => {
      return !!paymentCollectionids?.length
    }).then(() => {
      updatePaymentCollectionStep({
        selector: { id: paymentCollectionids },
        update: { status: PaymentCollectionStatus.CANCELED },
      })
    })

    cancelOrdersStep({ orderIds: [order.id] })

    const orderCanceled = createHook("orderCanceled", {
      order,
    })

    return new WorkflowResponse(void 0, {
      hooks: [orderCanceled],
    })
  }
)
