import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { updateCartsWorkflow } from "@medusajs/core-flows"
import { UpdateCartDataDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { defaultStoreCartFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, { cart: variables })

  res.json({ cart })
}

export const POST = async (
  req: MedusaRequest<UpdateCartDataDTO>,
  res: MedusaResponse
) => {
  const updateCartWorkflow = updateCartsWorkflow(req.scope)

  const { errors } = await updateCartWorkflow.run({
    input: {
      ...(req.validatedBody as UpdateCartDataDTO),
      id: req.params.id,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [updatedCart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart: updatedCart })
}
