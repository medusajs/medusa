import {
  CartDTO,
  CreatePaymentCollectionForCartWorkflowInputDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { retrieveCartStep } from "../steps"
import { createPaymentCollectionsStep } from "../steps/create-payment-collection"
import { linkCartAndPaymentCollectionsStep } from "../steps/link-cart-payment-collection"

export const createPaymentCollectionForCartWorkflowId =
  "create-payment-collection-for-cart"
export const createPaymentCollectionForCartWorkflow = createWorkflow(
  createPaymentCollectionForCartWorkflowId,
  (
    input: WorkflowData<CreatePaymentCollectionForCartWorkflowInputDTO>
  ): WorkflowData<CartDTO> => {
    const created = createPaymentCollectionsStep([input])

    const linksInput = {
      links: [
        {
          cart_id: input.cart_id,
          payment_collection_id: created[0].id,
        },
      ],
    }

    linkCartAndPaymentCollectionsStep(linksInput)

    const cart = retrieveCartStep({ id: input.cart_id })

    return cart
  }
)
