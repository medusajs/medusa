import { updateCartWorkflow } from "@medusajs/core-flows"
import {
  AdditionalData,
  HttpTypes,
  UpdateCartDataDTO,
} from "@medusajs/framework/types"

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchCart } from "../helpers"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ cart })
}

export const POST = async (
  req: MedusaRequest<UpdateCartDataDTO & AdditionalData>,
  res: MedusaResponse<{
    cart: HttpTypes.StoreCart
  }>
) => {
  const workflow = updateCartWorkflow(req.scope)

  await workflow.run({
    input: {
      ...req.validatedBody,
      id: req.params.id,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
