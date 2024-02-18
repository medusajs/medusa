import { createCartWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultStoreCartFields } from "../carts/query-config"
import { StorePostCartsCartReq } from "./validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const input = req.validatedBody as StorePostCartsCartReq

  // If the customer is logged in, we auto-assign them to the cart
  if (req?.user?.customer_id) {
    input.customer_id = req.user.customer_id
  }

  const { result, errors } = await createCartWorkflow(req.scope).run({
    input,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: result.id }

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, { cart: variables })

  res.status(200).json({ cart })
}
