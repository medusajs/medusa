import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@zjedene-medusa/framework/http"
import {
  deleteProductOptionsWorkflow,
  updateProductOptionsWorkflow,
} from "@zjedene-medusa/core-flows"

import { remapKeysForProduct, remapProductResponse } from "../../../helpers"
import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionResponse>
) => {
  const productId = req.params.id
  const optionId = req.params.option_id
  const productOption = await refetchEntity({
    entity: "product_option",
    idOrFilter: { id: optionId, product_id: productId },
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_option: productOption })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateProductOption & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const optionId = req.params.option_id
  const { additional_data, ...update } = req.validatedBody

  await updateProductOptionsWorkflow(req.scope).run({
    input: {
      selector: { id: optionId, product_id: productId },
      update,
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
  res: MedusaResponse<HttpTypes.AdminProductOptionDeleteResponse>
) => {
  const productId = req.params.id
  const optionId = req.params.option_id

  // TODO: I believe here we cannot even enforce the product ID based on the standard API we provide?
  await deleteProductOptionsWorkflow(req.scope).run({
    input: { ids: [optionId] /* product_id: productId */ },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: productId,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({
    id: optionId,
    object: "product_option",
    deleted: true,
    parent: product,
  })
}
