import { isPresent, MathBN } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  deletePaymentSessionsWorkflow,
  updatePaymentCollectionStep,
} from "../../payment-collection"

export type RefreshPaymentCollectionForCartWorklowInput = {
  cart_id: string
}

export const refreshPaymentCollectionForCartWorkflowId =
  "refresh-payment-collection-for-cart"
/**
 * This workflow refreshes the payment collections of a cart.
 */
export const refreshPaymentCollectionForCartWorkflow = createWorkflow(
  refreshPaymentCollectionForCartWorkflowId,
  (input: WorkflowData<RefreshPaymentCollectionForCartWorklowInput>) => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "region_id",
        "currency_code",
        "total",
        "raw_total",
        "payment_collection.id",
        "payment_collection.raw_amount",
        "payment_collection.currency_code",
        "payment_collection.amount",
        "payment_collection.payment_sessions.id",
      ],
      variables: { id: input.cart_id },
      throw_if_key_not_found: true,
      list: false,
    })

    when({ cart }, ({ cart }) => {
      const valueIsEqual = MathBN.eq(
        cart.payment_collection?.raw_amount ?? -1,
        cart.raw_total
      )

      if (valueIsEqual) {
        return cart.payment_collection.currency_code !== cart.currency_code
      }

      return true
    }).then(() => {
      const deletePaymentSessionInput = transform(
        { paymentCollection: cart.payment_collection },
        (data) => {
          return {
            ids:
              data.paymentCollection?.payment_sessions
                ?.map((ps) => ps.id)
                ?.flat(1) || [],
          }
        }
      )

      const updatePaymentCollectionInput = transform({ cart }, ({ cart }) => {
        if (!isPresent(cart.payment_collection?.id)) {
          return
        }

        return {
          selector: { id: cart.payment_collection.id },
          update: {
            amount: cart.total,
            currency_code: cart.currency_code,
            region_id: cart.region_id,
          },
        }
      })

      parallelize(
        deletePaymentSessionsWorkflow.runAsStep({
          input: deletePaymentSessionInput,
        }),
        updatePaymentCollectionStep(updatePaymentCollectionInput)
      )
    })
  }
)
