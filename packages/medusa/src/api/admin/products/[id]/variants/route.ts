import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { createProductVariantsWorkflow } from "@medusajs/core-flows"
import {
  remapKeysForProduct,
  remapKeysForVariant,
  remapProductResponse,
  remapVariantResponse,
} from "../../helpers"
import { HttpTypes } from "@medusajs/types"
import {
  refetchEntities,
  refetchEntity,
} from "../../../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const productId = req.params.id
  const { rows: variants, metadata } = await refetchEntities(
    "variant",
    { ...req.filterableFields, product_id: productId },
    req.scope,
    remapKeysForVariant(req.remoteQueryConfig.fields ?? []),
    req.remoteQueryConfig.pagination
  )

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
