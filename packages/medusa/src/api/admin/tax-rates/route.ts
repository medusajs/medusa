import { createTaxRatesWorkflow } from "@zjedene-medusa/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchTaxRate } from "./helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateTaxRate,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminTaxRateResponse>
) => {
  const { result } = await createTaxRatesWorkflow(req.scope).run({
    input: [
      {
        ...req.validatedBody,
        created_by: req.auth_context.actor_id,
      },
    ],
  })

  const taxRate = await refetchTaxRate(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ tax_rate: taxRate })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminTaxRateListParams>,
  res: MedusaResponse<HttpTypes.AdminTaxRateListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const { rows: tax_rates, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_rate",
      variables: {
        filters: req.filterableFields,
        ...req.queryConfig.pagination,
      },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({
    tax_rates,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
