import { createTaxRegionsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminPostTaxRegionsReq } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostTaxRegionsReq>,
  res: MedusaResponse
) => {
  const { result, errors } = await createTaxRegionsWorkflow(req.scope).run({
    input: [
      {
        ...req.validatedBody,
        created_by: req.auth.actor_id,
      },
    ],
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ tax_region: result[0] })
}
