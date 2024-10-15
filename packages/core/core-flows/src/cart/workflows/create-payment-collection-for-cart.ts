import {
  CartDTO,
  CreatePaymentCollectionForCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { createPaymentCollectionsStep } from "../steps/create-payment-collection"
import { validateCartStep } from "../steps/validate-cart"

/**
 * This step validates that a cart doesn't have a payment collection.
 */
export const validateExistingPaymentCollectionStep = createStep(
  "validate-existing-payment-collection",
  ({ cart }: { cart: CartDTO & { payment_collection?: any } }) => {
    if (cart.payment_collection) {
      throw new Error(`Cart ${cart.id} already has a payment collection`)
    }
  }
)

export const createPaymentCollectionForCartWorkflowId =
  "create-payment-collection-for-cart"
/**
 * This workflow creates a payment collection for a cart.
 */
export const createPaymentCollectionForCartWorkflow = createWorkflow(
  createPaymentCollectionForCartWorkflowId,
  (
    input: WorkflowData<CreatePaymentCollectionForCartWorkflowInputDTO>
  ): WorkflowData<void> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "region_id",
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
        cart_id: cart.id,
        currency_code: cart.currency_code,
        amount: cart.raw_total,
        region_id: cart.region_id,
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
  }
)
