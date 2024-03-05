import { createCartWorkflow } from "@medusajs/core-flows"
import { CreateCartWorkflowInputDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { defaultStoreCartFields } from "../carts/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCartWorkflowInputDTO>,
  res: MedusaResponse
) => {
  const workflowInput = {
    ...req.validatedBody,
    customer_id: req.auth?.actor_id,
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
