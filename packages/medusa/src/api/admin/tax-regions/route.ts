import { createTaxRegionsWorkflow } from "@zjedene-medusa/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchTaxRegion } from "./helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateTaxRegion,
    HttpTypes.AdminTaxRegionParams
  >,
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
    req.queryConfig.fields
  )
  res.status(200).json({ tax_region: taxRegion })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminTaxRegionListParams>,
  res: MedusaResponse<HttpTypes.AdminTaxRegionListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: tax_regions, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_regions",
      variables: {
        filters: req.filterableFields,
        ...req.queryConfig.pagination,
      },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({
    tax_regions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
