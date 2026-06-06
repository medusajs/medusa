import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { wrapVariantsWithTotalInventoryQuantity } from "../../utils/middlewares"
import { remapKeysForVariant, remapVariantResponse } from "../products/helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductVariantParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("inventory_quantity")
    )
  }

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
