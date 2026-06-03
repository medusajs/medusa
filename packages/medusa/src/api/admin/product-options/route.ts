import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { createProductOptionsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * @since 2.16.0
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductOptionListParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: product_options, metadata } = await query.graph({
    entity: "product_option",
    filters: req.filterableFields,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    product_options,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

/**
 * @since 2.16.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateProductOption>,
  res: MedusaResponse<HttpTypes.AdminProductOptionResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createProductOptionsWorkflow(req.scope).run({
    input: { product_options: input },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [productOption],
  } = await query.graph({
    entity: "product_option",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_option: productOption })
}
