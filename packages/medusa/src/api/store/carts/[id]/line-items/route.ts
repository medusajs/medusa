import { addToCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchCart } from "../../helpers"
import { StoreAddCartLineItemType } from "../../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: MedusaRequest<StoreAddCartLineItemType>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  const workflowInput = {
    items: [req.validatedBody],
    cart,
  }

  await addToCartWorkflow(req.scope).run({
    input: workflowInput,
  } as any)

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}
