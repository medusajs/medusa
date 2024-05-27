import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  deleteProductVariantsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/core-flows"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  refetchProduct,
  remapKeysForVariant,
  remapProductResponse,
  remapVariantResponse,
} from "../../../helpers"
import { AdminUpdateProductVariantType } from "../../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  const variables = { id: variantId, product_id: productId }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "variant",
    variables,
    fields: remapKeysForVariant(req.remoteQueryConfig.fields ?? []),
  })

  const [variant] = await remoteQuery(queryObject)
  res.status(200).json({ variant: remapVariantResponse(variant) })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductVariantType>,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  await updateProductVariantsWorkflow(req.scope).run({
    input: {
      selector: { id: variantId, product_id: productId },
      update: req.validatedBody,
    },
  })

  const product = await refetchProduct(
    productId,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a variant without knowing the product ID? In such case we'll need to change the route to /admin/products/variants/:id
  const productId = req.params.id
  const variantId = req.params.variant_id

  // TODO: I believe here we cannot even enforce the product ID based on the standard API we provide?
  await deleteProductVariantsWorkflow(req.scope).run({
    input: { ids: [variantId] /* product_id: productId */ },
  })

  const product = await refetchProduct(
    productId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: variantId,
    object: "variant",
    deleted: true,
    parent: product,
  })
}
