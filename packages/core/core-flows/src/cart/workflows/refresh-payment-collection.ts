import { MathBN, isPresent } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { updatePaymentCollectionStep } from "../../payment-collection"
import { deletePaymentSessionsWorkflow } from "../../payment-collection/workflows/delete-payment-sessions"
import { validateCartStep } from "../steps"

/**
 * The details of the cart to refresh.
 */
export type RefreshPaymentCollectionForCartWorklowInput = {
  /**
   * The cart's ID.
   */
  cart_id?: string
  /**
   * The Cart reference.
   */
  cart?: any
}

export const refreshPaymentCollectionForCartWorkflowId =
  "refresh-payment-collection-for-cart"
/**
 * This workflow refreshes a cart's payment collection, which is useful once the cart is created or when its details
 * are updated. If the cart's total changes to the amount in its payment collection, the payment collection's payment sessions are
 * deleted. It also syncs the payment collection's amount, currency code, and other details with the details in the cart.
 *
 * This workflow is used by other cart-related workflows, such as the {@link refreshCartItemsWorkflow} to refresh the cart's
 * payment collection after an update.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to refresh the cart's payment collection after making updates to it in your
 * custom flows.
 *
 * @example
 * const { result } = await refreshPaymentCollectionForCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *   }
 * })
 *
 * @summary
 *
 * Refresh a cart's payment collection details.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 */
export const refreshPaymentCollectionForCartWorkflow = createWorkflow(
  {
    name: refreshPaymentCollectionForCartWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<RefreshPaymentCollectionForCartWorklowInput>) => {
    const shouldExecute = transform({ input }, ({ input }) => {
      if (input.cart) {
        return !!input.cart.payment_collection
      }

      return !!input.cart_id
    })

    const cartId = transform({ input }, ({ input }) => {
      return input.cart_id ?? input.cart?.id
    })

    const fetchCart = when(
      "should-fetch-cart",
      { shouldExecute },
      ({ shouldExecute }) => {
        return shouldExecute
      }
    ).then(() => {
      const { data: cart } = useQueryGraphStep({
        entity: "cart",
        fields: [
          "id",
          "region_id",
          "currency_code",
          "total",
          "raw_total",
          "payment_collection.id",
          "payment_collection.raw_amount",
          "payment_collection.amount",
          "payment_collection.currency_code",
          "payment_collection.payment_sessions.id",
        ],
        filters: { id: cartId },
        options: {
          throwIfKeyNotFound: true,
          isList: false,
        },
      }).config({ name: "fetch-cart" })

      return cart
    })

    const cart = transform({ fetchCart, input }, ({ fetchCart, input }) => {
      return fetchCart ?? input.cart
    })

    validateCartStep({ cart })

    acquireLockStep({
      key: cart.id,
      timeout: 2,
      ttl: 10,
    })

    const validate = createHook("validate", {
      input,
      cart,
    })

    when(
      "should-update-payment-collection",
      { cart, shouldExecute },
      ({ cart, shouldExecute }) => {
        const valueIsEqual = MathBN.eq(
          cart.payment_collection?.raw_amount ?? -1,
          cart.raw_total
        )

        if (valueIsEqual) {
          return cart.payment_collection.currency_code !== cart.currency_code
        }

        return shouldExecute
      }
    ).then(() => {
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
            amount: cart.raw_total,
            currency_code: cart.currency_code,
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

    releaseLockStep({
      key: cart.id,
    })

    return new WorkflowResponse(void 0, {
      hooks: [validate],
    })
  }
)
