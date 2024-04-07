import { createTaxRegionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateTaxRegionType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateTaxRegionType>,
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
    fields: req.remoteQueryConfig.fields,
  })

  const [taxRegion] = await remoteQuery(query)

  res.status(200).json({ tax_region: taxRegion })
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  console.log("req.remoteQueryConfig.fields - ", req.remoteQueryConfig.fields)
  console.log("req.filterableFields - ", req.filterableFields)
  const tax_regions = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_regions",
      variables: {
        filters: req.filterableFields,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({
    tax_regions,
  })
}
