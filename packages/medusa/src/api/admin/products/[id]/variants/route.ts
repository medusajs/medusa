import { createProductVariantsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { wrapVariantsWithInventoryQuantity } from "../../../../utils/middlewares"
import {
  refetchEntities,
  refetchEntity,
} from "../../../../utils/refetch-entity"
import {
  remapKeysForProduct,
  remapKeysForVariant,
  remapProductResponse,
  remapVariantResponse,
} from "../../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const productId = req.params.id

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
    { ...req.filterableFields, product_id: productId },
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

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateProductVariant>,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const input = [
    {
      ...req.validatedBody,
      product_id: productId,
    },
  ]

  await createProductVariantsWorkflow(req.scope).run({
    input: { product_variants: input },
  })

  const product = await refetchEntity(
    "product",
    productId,
    req.scope,
    remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  )

  res.status(200).json({ product: remapProductResponse(product) })
}
