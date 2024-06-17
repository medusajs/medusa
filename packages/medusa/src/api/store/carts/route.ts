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
    customer_id: req.auth_context?.actor_id,
  }

  const { result } = await createCartWorkflow(req.scope).run({
    input: workflowInput,
  })

  const cart = await refetchCart(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
