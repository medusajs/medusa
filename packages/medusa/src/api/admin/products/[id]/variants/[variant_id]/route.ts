import {
  deleteProductVariantsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import { refetchEntity } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import {
  remapKeysForProduct,
  remapKeysForVariant,
  remapProductResponse,
  remapVariantResponse,
} from "../../../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantResponse>
) => {
  const productId = req.params.id
  const variantId = req.params.variant_id
  const variables = { id: variantId, product_id: productId }

  const variant = await refetchEntity({
    entity: "variant",
    idOrFilter: variables,
    scope: req.scope,
    fields: remapKeysForVariant(req.queryConfig.fields ?? []),
  })

  res.status(200).json({ variant: remapVariantResponse(variant) })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateProductVariant & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const variantId = req.params.variant_id
  const { additional_data, ...update } = req.validatedBody

  await updateProductVariantsWorkflow(req.scope).run({
    input: {
      selector: { id: variantId, product_id: productId },
      update: update,
      additional_data,
    },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: productId,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantDeleteResponse>
) => {
  const productId = req.params.id
  const variantId = req.params.variant_id

  const variant = await refetchEntity({
    entity: "variant",
    idOrFilter: { id: variantId, product_id: productId },
    scope: req.scope,
    fields: ["id"],
  })

  if (!variant) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Variant with id: ${variantId} not found for product with id: ${productId}`
    )
  }

  await deleteProductVariantsWorkflow(req.scope).run({
    input: { ids: [variantId] },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: productId,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({
    id: variantId,
    object: "variant",
    deleted: true,
    parent: remapProductResponse(product),
  })
}
