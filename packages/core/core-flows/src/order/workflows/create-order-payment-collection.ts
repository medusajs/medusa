import { PaymentCollectionDTO } from "@medusajs/types"
import {
  MathBN,
  MedusaError,
  Modules,
  PaymentCollectionStatus,
} from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../common"
import { createPaymentCollectionsStep } from "../../definition"

/**
 * This step validates that the order doesn't have an active payment collection.
 */
export const throwIfActivePaymentCollectionExists = createStep(
  "validate-existing-payment-collection",
  ({ paymentCollection }: { paymentCollection: PaymentCollectionDTO }) => {
    if (paymentCollection) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Active payment collections were found. Complete existing ones or delete them before proceeding.`
      )
    }
  }
)

export const createOrderPaymentCollectionWorkflowId =
  "create-order-payment-collection"
/**
 * This workflow creates a payment collection for an order.
 */
export const createOrderPaymentCollectionWorkflow = createWorkflow(
  createOrderPaymentCollectionWorkflowId,
  (
    input: WorkflowData<{
      order_id: string
      amount?: number
    }>
  ) => {
    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: ["id", "summary", "currency_code", "region_id"],
      variables: { id: input.order_id },
      throw_if_key_not_found: true,
      list: false,
    })

    const orderPaymentCollections = useRemoteQueryStep({
      entry_point: "order_payment_collection",
      fields: ["payment_collection_id"],
      variables: { order_id: order.id },
    }).config({ name: "order-payment-collection-query" })

    const orderPaymentCollectionIds = transform(
      { orderPaymentCollections },
      ({ orderPaymentCollections }) =>
        orderPaymentCollections.map((opc) => opc.payment_collection_id)
    )

    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id"],
      variables: {
        id: orderPaymentCollectionIds,
        status: [
          PaymentCollectionStatus.NOT_PAID,
          PaymentCollectionStatus.AWAITING,
        ],
      },
      list: false,
    }).config({ name: "payment-collection-query" })

    throwIfActivePaymentCollectionExists({ paymentCollection })

    const paymentCollectionData = transform(
      { order, input },
      ({ order, input }) => {
        const pendingPayment = MathBN.sub(
          order.summary.raw_current_order_total,
          order.summary.raw_original_order_total
        )

        if (MathBN.lte(pendingPayment, 0)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Cannot create a payment collection for amount less than 0`
          )
        }

        if (input.amount && MathBN.gt(input.amount, pendingPayment)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Cannot create a payment collection for amount greater than ${pendingPayment}`
          )
        }

        return {
          currency_code: order.currency_code,
          amount: input.amount ?? pendingPayment,
          region_id: order.region_id,
        }
      }
    )

    const createdPaymentCollections = createPaymentCollectionsStep([
      paymentCollectionData,
    ])

    const orderPaymentCollectionLink = transform(
      { order, createdPaymentCollections },
      ({ order, createdPaymentCollections }) => {
        return [
          {
            [Modules.ORDER]: { order_id: order.id },
            [Modules.PAYMENT]: {
              payment_collection_id: createdPaymentCollections[0].id,
            },
          },
        ]
      }
    )

    createRemoteLinkStep(orderPaymentCollectionLink).config({
      name: "order-payment-collection-link",
    })

    return new WorkflowResponse(createdPaymentCollections)
  }
)
