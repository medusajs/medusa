import { createTaxRegionsWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchTaxRegion } from "./helpers"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateTaxRegion>,
  res: MedusaResponse<HttpTypes.AdminTaxRegionResponse>
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
  req: AuthenticatedMedusaRequest<HttpTypes.AdminTaxRegionListParams>,
  res: MedusaResponse<HttpTypes.AdminTaxRegionListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: tax_regions, metadata } = await query.graph({
    entryPoint: "tax_region",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({
    tax_regions,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}
