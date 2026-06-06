import {
  deleteProductVariantsWorkflow,
  updateProductVariantsWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"
import { refetchEntity } from "@zjedene-medusa/framework/http"
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

  // TODO: I believe here we cannot even enforce the product ID based on the standard API we provide?
  await deleteProductVariantsWorkflow(req.scope).run({
    input: { ids: [variantId] /* product_id: productId */ },
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
