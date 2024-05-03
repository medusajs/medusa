import { LinkModuleUtils, Modules } from "@medusajs/modules-sdk"
import { CartWorkflowDTO } from "@medusajs/types"
import { isObject, remoteQueryObjectFromString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart_or_cart_id: string | CartWorkflowDTO
  fields: string[]
}

export const retrieveCartWithLinksStepId = "retrieve-cart-with-links"
export const retrieveCartWithLinksStep = createStep(
  retrieveCartWithLinksStepId,
  async (data: StepInput, { container }) => {
    const { cart_or_cart_id: cartOrCartId, fields } = data

    if (isObject(cartOrCartId)) {
      return new StepResponse(cartOrCartId)
    }

    const id = cartOrCartId
    const remoteQuery = container.resolve(LinkModuleUtils.REMOTE_QUERY)
    const query = remoteQueryObjectFromString({
      entryPoint: Modules.CART,
      fields,
    })

    const [cart] = await remoteQuery(query, { cart: { id } })

    return new StepResponse(cart)
  }
)
