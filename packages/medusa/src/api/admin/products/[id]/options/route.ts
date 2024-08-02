import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { createProductOptionsWorkflow } from "@medusajs/core-flows"
import { remapKeysForProduct, remapProductResponse } from "../../helpers"
import { HttpTypes } from "@medusajs/types"
import {
  refetchEntities,
  refetchEntity,
} from "../../../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductOptionParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionListResponse>
) => {
  const productId = req.params.id
  const { rows: product_options, metadata } = await refetchEntities(
    "product_option",
    { ...req.filterableFields, product_id: productId },
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )

  res.json({
    product_options,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProductOption & {
      additional_data?: Record<string, unknown>
    }
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const { additional_data, ...rest } = req.validatedBody

  await createProductOptionsWorkflow(req.scope).run({
    input: {
      product_options: [
        {
          ...rest,
          product_id: productId,
        },
      ],
      additional_data,
    },
  })

  const product = await refetchEntity(
    "product",
    productId,
    req.scope,
    remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  )
  res.status(200).json({ product: remapProductResponse(product) })
}
