import { addToCartWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { defaultStoreCartFields } from "../../query-config"
import { StorePostCartsCartLineItemsReq } from "./validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartModuleService = req.scope.resolve<ICartModuleService>(
    ModuleRegistrationName.CART
  )
  const remoteQuery = req.scope.resolve("remoteQuery")

  const cart = await cartModuleService.retrieve(req.params.id, {
    select: ["id", "region_id", "currency_code"],
  })

  const workflowInput = {
    items: [req.validatedBody as StorePostCartsCartLineItemsReq],
    cart,
  }

  const { errors } = await addToCartWorkflow(req.scope).run({
    input: workflowInput,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [updatedCart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart: updatedCart })
}
