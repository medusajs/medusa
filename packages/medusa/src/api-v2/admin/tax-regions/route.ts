import { createTaxRegionsWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { defaultAdminTaxRegionFields } from "./query-config"
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

  const remoteQuery = req.scope.resolve("remoteQuery")

  const query = remoteQueryObjectFromString({
    entryPoint: "tax_region",
    variables: { id: result[0].id },
    fields: defaultAdminTaxRegionFields,
  })

  const [taxRegion] = await remoteQuery(query)

  res.status(200).json({ tax_region: taxRegion })
}
