import { createCartWorkflow } from "@medusajs/core-flows"
import { CreateCartDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultStoreCartRemoteQueryObject } from "../carts/query-config"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = createCartWorkflow(req.scope)

  const { result, errors } = await workflow.run({
    input: { cartData: req.validatedBody as CreateCartDTO },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: result[0].id }

  const query = {
    cart: {
      ...defaultStoreCartRemoteQueryObject,
    },
  }

  const [cart] = await remoteQuery(query, { cart: variables })

  res.status(200).json({ cart })
}
