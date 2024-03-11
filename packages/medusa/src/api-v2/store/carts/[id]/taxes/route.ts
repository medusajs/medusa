import { updateTaxLinesWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { defaultStoreCartFields } from "../../query-config"
import { StorePostCartsCartTaxesReq } from "../../validators"

export const POST = async (
  req: MedusaRequest<StorePostCartsCartTaxesReq>,
  res: MedusaResponse
) => {
  const workflow = updateTaxLinesWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      cart_or_cart_id: req.params.id,
      force_tax_calculation: true,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.CART,
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart })
}
