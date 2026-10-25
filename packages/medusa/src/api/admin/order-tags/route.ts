import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"
import { OrderTagDTO } from "@medusajs/framework/types"

import { createOrderTagsWorkflow } from "@medusajs/core-flows"
import {
  AdminCreateOrderTagType,
  AdminGetOrderTagsParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetOrderTagsParamsType>,
  res: MedusaResponse<{
    order_tags: OrderTagDTO[]
    count: number
    offset: number
    limit: number
  }>
) => {
  const { data: order_tags, metadata } = await refetchEntities({
    entity: "order_tag",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    order_tags: order_tags as OrderTagDTO[],
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateOrderTagType>,
  res: MedusaResponse<{ order_tag: OrderTagDTO }>
) => {
  const input = [req.validatedBody]

  const { result } = await createOrderTagsWorkflow(req.scope).run({
    input: { order_tags: input },
  })

  const orderTag = await refetchEntity({
    entity: "order_tag",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order_tag: orderTag as OrderTagDTO })
}
