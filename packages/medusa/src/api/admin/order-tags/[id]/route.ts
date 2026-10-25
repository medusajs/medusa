import {
  deleteOrderTagsWorkflow,
  updateOrderTagsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { OrderTagDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { AdminUpdateOrderTagType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<{ order_tag: OrderTagDTO }>
) => {
  const orderTag = await refetchEntity({
    entity: "order_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order_tag: orderTag as OrderTagDTO })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateOrderTagType>,
  res: MedusaResponse<{ order_tag: OrderTagDTO }>
) => {
  const existingOrderTag = await refetchEntity({
    entity: "order_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: ["id"],
  })

  if (!existingOrderTag) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order tag with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateOrderTagsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const orderTag = await refetchEntity({
    entity: "order_tag",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order_tag: orderTag as OrderTagDTO })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<{
    id: string
    object: "order_tag"
    deleted: boolean
  }>
) => {
  const id = req.params.id

  await deleteOrderTagsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "order_tag",
    deleted: true,
  })
}
