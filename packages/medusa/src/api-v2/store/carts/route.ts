import { createCartWorkflow } from "@medusajs/core-flows"
import { CreateCartWorkflowInputDTO } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchCart } from "./helpers"

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

  const cart = await refetchCart(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
