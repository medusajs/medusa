import { updateCartWorkflow } from "@medusajs/core-flows"
import { AdditionalData, UpdateCartDataDTO } from "@medusajs/types"

import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchCart } from "../helpers"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ cart })
}

export const POST = async (
  req: MedusaRequest<UpdateCartDataDTO & AdditionalData>,
  res: MedusaResponse
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
