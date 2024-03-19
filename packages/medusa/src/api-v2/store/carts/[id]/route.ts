import { updateCartWorkflow } from "@medusajs/core-flows"
import { LinkModuleUtils, Modules } from "@medusajs/modules-sdk"
import { UpdateCartDataDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultStoreCartFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(LinkModuleUtils.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.CART,
    fields: req.remoteQueryConfig.fields,
  })

  const [cart] = await remoteQuery(query, { cart: variables })

  res.json({ cart })
}

export const POST = async (
  req: MedusaRequest<UpdateCartDataDTO>,
  res: MedusaResponse
) => {
  const workflow = updateCartWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      ...(req.validatedBody as UpdateCartDataDTO),
      id: req.params.id,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(LinkModuleUtils.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.CART,
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart })
}
