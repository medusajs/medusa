import {
  deleteProductTagsWorkflow,
  updateProductTagsWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminProductTagParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductTagResponse>
) => {
  const productTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_tag: productTag })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateProductTag,
    HttpTypes.AdminProductTagParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductTagResponse>
) => {
  const existingProductTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: ["id"],
  })

  if (!existingProductTag) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product tag with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductTagsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const productTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_tag: productTag })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductTagDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductTagsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_tag",
    deleted: true,
  })
}
