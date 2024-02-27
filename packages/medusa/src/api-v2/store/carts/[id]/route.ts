import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { UpdateCartDataDTO } from "@medusajs/types"
import { defaultStoreCartFields } from "../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { updateCartsWorkflow } from "@medusajs/core-flows"

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

  const workflowInput = {
    selector: { id: req.params.id },
    update: req.validatedBody,
  }

  const { result, errors } = await updateCartWorkflow.run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ cart: result[0] })
}
