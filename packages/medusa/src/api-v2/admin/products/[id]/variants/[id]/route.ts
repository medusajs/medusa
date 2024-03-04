import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  deleteProductVariantsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/core-flows"

import { UpdateProductVariantDTO } from "@medusajs/types"
import { defaultAdminProductsVariantFields } from "../../../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  const variables = { id: variantId, product_id: productId }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_variant",
    variables,
    fields: defaultAdminProductsVariantFields,
  })

  const [product_variant] = await remoteQuery(queryObject)
  res.status(200).json({ product_variant })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateProductVariantDTO>,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  const { result, errors } = await updateProductVariantsWorkflow(req.scope).run(
    {
      input: {
        selector: { id: variantId, product_id: productId },
        update: req.validatedBody,
      },
      throwOnError: false,
    }
  )

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ product_variant: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  // TODO: I believe here we cannot even enforce the product ID based on the standard API we provide?
  const { errors } = await deleteProductVariantsWorkflow(req.scope).run({
    input: { ids: [variantId], product_id: productId },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id: variantId,
    object: "product_variant",
    deleted: true,
  })
}
