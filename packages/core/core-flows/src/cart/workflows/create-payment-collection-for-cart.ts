import {
  CartDTO,
  CreatePaymentCollectionForCartWorkflowInputDTO,
  PaymentCollectionDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { createPaymentCollectionsStep } from "../steps/create-payment-collection"
import { validateCartStep } from "../steps/validate-cart"

/**
 * The details of the cart to validate its payment collection.
 */
export type ValidateExistingPaymentCollectionStepInput = {
  /**
   * The cart to validate.
   */
  cart: CartDTO & { payment_collection?: any }
}

/**
 * This step validates that a cart doesn't have a payment collection.
 * If the cart has a payment collection, the step throws an error.
 *
 * :::tip
 *
 * You can use the {@link retrieveCartStep} to retrieve a cart's details.
 *
 * :::
 *
 * @example
 * const data = validateExistingPaymentCollectionStep({
 *   cart: {
 *     // other cart details...
 *     payment_collection: {
 *       id: "paycol_123",
 *       // other payment collection details.
 *     }
 *   }
 * })
 */
export const validateExistingPaymentCollectionStep = createStep(
  "validate-existing-payment-collection",
  ({ cart }: ValidateExistingPaymentCollectionStepInput) => {
    if (cart.payment_collection) {
      throw new Error(`Cart ${cart.id} already has a payment collection`)
    }
  }
)

export const createPaymentCollectionForCartWorkflowId =
  "create-payment-collection-for-cart"
/**
 * This workflow creates a payment collection for a cart. It's executed by the
 * [Create Payment Collection Store API Route](https://docs.medusajs.com/api/store/payment-collections/create-payment-collection).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to wrap custom logic around adding creating a payment collection for a cart.
 *
 * @example
 * const { result } = await createPaymentCollectionForCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     metadata: {
 *       sandbox: true
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create payment collection for cart.
 */
export const createPaymentCollectionForCartWorkflow = createWorkflow(
  {
    name: createPaymentCollectionForCartWorkflowId,
    idempotent: false,
  },
  (
    input: WorkflowData<CreatePaymentCollectionForCartWorkflowInputDTO>
  ): WorkflowResponse<PaymentCollectionDTO> => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "completed_at",
        "currency_code",
        "total",
        "raw_total",
        "payment_collection.id",
      ],
      variables: { id: input.cart_id },
      throw_if_key_not_found: true,
      list: false,
    })

    parallelize(
      validateCartStep({ cart }),
      validateExistingPaymentCollectionStep({ cart })
    )

    const paymentData = transform({ cart }, ({ cart }) => {
      return {
        currency_code: cart.currency_code,
        amount: cart.raw_total,
      }
    })

    const created = createPaymentCollectionsStep([paymentData])

    const cartPaymentLink = transform(
      { cartId: input.cart_id, created },
      (data) => {
        return [
          {
            [Modules.CART]: { cart_id: data.cartId },
            [Modules.PAYMENT]: { payment_collection_id: data.created[0].id },
          },
        ]
      }
    )

    createRemoteLinkStep(cartPaymentLink).config({
      name: "cart-payment-collection-link",
    })

    releaseLockStep({
      key: input.cart_id,
    })

    return new WorkflowResponse(created[0])
  }
)
