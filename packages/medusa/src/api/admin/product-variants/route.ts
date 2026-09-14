import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  prepareInventoryQuantityFields,
  wrapVariantsWithTotalInventoryQuantity,
} from "../../utils/middlewares"
import { remapKeysForVariant, remapVariantResponse } from "../products/helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductVariantParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const { fields, withInventoryQuantity } = prepareInventoryQuantityFields(
    req.queryConfig.fields
  )
  req.queryConfig.fields = fields

  const { data: variants, metadata } = await refetchEntities({
    entity: "variant",
    idOrFilter: { ...req.filterableFields },
    scope: req.scope,
    fields: remapKeysForVariant(req.queryConfig.fields ?? []),
    pagination: req.queryConfig.pagination,
  })

  if (withInventoryQuantity) {
    await wrapVariantsWithTotalInventoryQuantity(req, variants || [])
  }

  res.json({
    variants: variants.map(remapVariantResponse),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
