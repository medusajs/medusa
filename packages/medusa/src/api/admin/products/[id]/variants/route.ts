import { createProductVariantsWorkflow } from "@medusajs/core-flows"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  prepareInventoryQuantityFields,
  wrapVariantsWithTotalInventoryQuantity,
} from "../../../../utils/middlewares"
import { refetchEntities, refetchEntity } from "@medusajs/framework/http"
import {
  remapKeysForProduct,
  remapKeysForVariant,
  remapProductResponse,
  remapVariantResponse,
} from "../../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductVariantParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const productId = req.params.id

  const { fields, withInventoryQuantity } = prepareInventoryQuantityFields(
    req.queryConfig.fields
  )
  req.queryConfig.fields = fields

  const { data: variants, metadata } = await refetchEntities({
    entity: "variant",
    idOrFilter: { ...req.filterableFields, product_id: productId },
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

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProductVariant & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const { additional_data, ...rest } = req.validatedBody

  const input = [
    {
      ...rest,
      product_id: productId,
    },
  ]

  await createProductVariantsWorkflow(req.scope).run({
    input: { product_variants: input, additional_data },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: productId,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({ product: remapProductResponse(product) })
}
