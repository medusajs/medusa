import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { createProductTagsWorkflow } from "@medusajs/core-flows"
import {
  AdminCreateProductTagType,
  AdminGetProductTagsParamsType,
} from "./validators"
import { refetchEntities, refetchEntity } from "../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductTagsParamsType>,
  res: MedusaResponse
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
  req: AuthenticatedMedusaRequest<AdminCreateProductTagType>,
  res: MedusaResponse
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
