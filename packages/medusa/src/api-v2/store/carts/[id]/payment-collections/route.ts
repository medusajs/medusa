import { createPaymentCollectionForCartWorkflow } from "@medusajs/core-flows"
import { UpdateCartDataDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { defaultStoreCartFields } from "../../query-config"

export const POST = async (
  req: MedusaRequest<UpdateCartDataDTO>,
  res: MedusaResponse
) => {
  const workflow = createPaymentCollectionForCartWorkflow(req.scope)

  const remoteQuery = req.scope.resolve("remoteQuery")

  let [cart] = await remoteQuery(
    {
      cart: {
        fields: ["id", "currency_code", "region_id", "total"],
      },
    },
    {
      cart: { id: req.params.id },
    }
  )

  const { errors } = await workflow.run({
    input: {
      cart_id: req.params.id,
      region_id: cart.region_id,
      currency_code: cart.currency_code,
      amount: cart.total ?? 0, // TODO: This should be calculated from the cart when totals decoration is introduced
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    variables: { id: req.params.id },
    fields: defaultStoreCartFields,
  })

  ;[cart] = await remoteQuery(query)

  res.status(200).json({ cart })
}
