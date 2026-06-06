import {
  deleteTaxRegionsWorkflow,
  updateTaxRegionsWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes, RemoteQueryFunction } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminTaxRegionParams>,
  res: MedusaResponse<HttpTypes.AdminTaxRegionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const filters = { id: req.params.id }
  const [taxRegion] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_region",
      variables: { filters },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({ tax_region: taxRegion })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateTaxRegion,
    HttpTypes.AdminTaxRegionParams
  >,
  res: MedusaResponse<HttpTypes.AdminTaxRegionResponse>
) => {
  const { id } = req.params
  const query = req.scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  )

  await updateTaxRegionsWorkflow(req.scope).run({
    input: [
      {
        id,
        ...req.validatedBody,
      },
    ],
  })

  const {
    data: [tax_region],
  } = await query.graph(
    {
      entity: "tax_region",
      fields: req.queryConfig.fields,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  )

  return res.json({ tax_region })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminTaxRegionDeleteResponse>
) => {
  const id = req.params.id

  await deleteTaxRegionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "tax_region",
    deleted: true,
  })
}
