import { updateCartWorkflowId } from "@zjedene-medusa/core-flows"
import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"

import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { Modules } from "@zjedene-medusa/framework/utils"
import { refetchCart } from "../helpers"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreGetCartsCart>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.json({ cart })
}

export const POST = async (
  req: MedusaRequest<
    HttpTypes.StoreUpdateCart & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<{
    cart: HttpTypes.StoreCart
  }>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)

  await we.run(updateCartWorkflowId, {
    input: {
      ...req.validatedBody,
      id: req.params.id,
      additional_data: req.validatedBody.additional_data,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart })
}
