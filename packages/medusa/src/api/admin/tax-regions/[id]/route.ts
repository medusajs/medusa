import { deleteTaxRegionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminTaxRegionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const filters = { id: req.params.id }
  const [taxRegion] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_region",
      variables: { filters },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({ tax_region: taxRegion })
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
