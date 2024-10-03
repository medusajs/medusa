import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"

import { createProductTagsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductTagListParams>,
  res: MedusaResponse<HttpTypes.AdminProductTagListResponse>
) => {
  const { rows: product_tags, metadata } = await refetchEntities(
    "product_tag",
    req.filterableFields,
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )

  res.json({
    product_tags: product_tags,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateProductTag>,
  res: MedusaResponse<HttpTypes.AdminProductTagResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createProductTagsWorkflow(req.scope).run({
    input: { product_tags: input },
  })

  const productTag = await refetchEntity(
    "product_tag",
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_tag: productTag })
}
