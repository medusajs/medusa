import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { CreateCartWorkflowInputDTO } from "@medusajs/types"
import { StorePostCartReq } from "./validators"
import { createCartWorkflow } from "@medusajs/core-flows"
import { defaultStoreCartFields } from "../carts/query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCartWorkflowInputDTO>,
  res: MedusaResponse
) => {
  const workflowInput = req.validatedBody

  // If the customer is logged in, we auto-assign them to the cart
  if (req.auth?.actor_id) {
    workflowInput.customer_id = req.auth.actor_id
  }

  const { result, errors } = await createCartWorkflow(req.scope).run({
    input: workflowInput,
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
