import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { wrapVariantsWithInventoryQuantity } from "../../utils/middlewares"
import { remapKeysForVariant, remapVariantResponse } from "../products/helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductVariantParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const withInventoryQuantity = req.remoteQueryConfig.fields.some((field) =>
    field.includes("inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.remoteQueryConfig.fields = req.remoteQueryConfig.fields.filter(
      (field) => !field.includes("inventory_quantity")
    )
  }

  const { rows: variants, metadata } = await refetchEntities(
    "variant",
    { ...req.filterableFields },
    req.scope,
    remapKeysForVariant(req.remoteQueryConfig.fields ?? []),
    req.remoteQueryConfig.pagination
  )

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantity(req, variants || [])
  }

  res.json({
    variants: variants.map(remapVariantResponse),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
