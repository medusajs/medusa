import { addToCartWorkflow } from "@medusajs/core-flows"
import { LinkModuleUtils, Modules } from "@medusajs/modules-sdk"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { defaultStoreCartFields } from "../../query-config"
import { StorePostCartsCartLineItemsReq } from "./validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(LinkModuleUtils.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.CART,
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  const workflowInput = {
    items: [req.validatedBody as StorePostCartsCartLineItemsReq],
    cart,
  }

  const { errors } = await addToCartWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [updatedCart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart: updatedCart })
}
