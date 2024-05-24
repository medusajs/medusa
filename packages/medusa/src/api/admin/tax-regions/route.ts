import { createTaxRegionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  AdminCreateTaxRegionType,
  AdminGetTaxRegionsParamsType,
} from "./validators"
import { refetchTaxRegion } from "./helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateTaxRegionType>,
  res: MedusaResponse
) => {
  const { result } = await createTaxRegionsWorkflow(req.scope).run({
    input: [
      {
        ...req.validatedBody,
        created_by: req.auth_context.actor_id,
      },
    ],
  })

  const taxRegion = await refetchTaxRegion(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ tax_region: taxRegion })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetTaxRegionsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: tax_regions, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_regions",
      variables: {
        filters: req.filterableFields,
        ...req.remoteQueryConfig.pagination,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({
    tax_regions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
