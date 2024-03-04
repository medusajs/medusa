import { createCartWorkflow } from "@medusajs/core-flows"
import { LinkModuleUtils, Modules } from "@medusajs/modules-sdk"
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

  const remoteQuery = req.scope.resolve(LinkModuleUtils.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: Modules.CART,
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, { cart: { id: result.id } })

  res.status(200).json({ cart })
}
