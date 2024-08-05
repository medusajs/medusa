import {
  CartDTO,
  CreatePaymentCollectionForCartWorkflowInputDTO,
} from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep } from "../../../common/steps/create-remote-links"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { createPaymentCollectionsStep } from "../steps/create-payment-collection"

const validateExistingPaymentCollection = createStep(
  "validate-existing-payment-collection",
  ({ cart }: { cart: CartDTO & { payment_collection?: any } }) => {
    if (cart.payment_collection) {
      throw new Error("Cart already has a payment collection")
    }
  }
)

export const createPaymentCollectionForCartWorkflowId =
  "create-payment-collection-for-cart"
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
        "currency_code",
        "total",
        "raw_total",
        "payment_collection.id",
      ],
      variables: { id: input.cart_id },
      throw_if_key_not_found: true,
      list: false,
    })

    validateExistingPaymentCollection({ cart })

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
