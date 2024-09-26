import { Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../common"
import { createPaymentCollectionsStep } from "../../cart"

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
      amount: number
    }>
  ) => {
    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: ["id", "summary", "currency_code", "region_id"],
      variables: { id: input.order_id },
      throw_if_key_not_found: true,
      list: false,
    })

    const paymentCollectionData = transform(
      { order, input },
      ({ order, input }) => {
        return {
          currency_code: order.currency_code,
          amount: input.amount,
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
