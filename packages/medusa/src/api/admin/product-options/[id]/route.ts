import {
  deleteProductOptionsWorkflow,
  updateProductOptionsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * @since 2.16.0
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [product_option],
  } = await query.graph({
    entity: "product_option",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_option })
}

/**
 * @since 2.16.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUpdateProductOption>,
  res: MedusaResponse<HttpTypes.AdminProductOptionResponse>
) => {
  const { result } = await updateProductOptionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [product_option],
  } = await query.graph({
    entity: "product_option",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_option })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductOptionDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductOptionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_option",
    deleted: true,
  })
}
