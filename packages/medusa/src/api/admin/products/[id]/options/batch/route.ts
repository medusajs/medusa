import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { createAndLinkProductOptionsToProductWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { remapKeysForProduct, remapProductResponse } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminLinkProductOptions>,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await createAndLinkProductOptionsToProductWorkflow(req.scope).run({
    input: {
      product_id: productId,
      ...req.validatedBody,
    },
  })

  const { data: products } = await query.graph({
    entity: "product",
    filters: { id: productId },
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })
  const product = products[0]

  res.status(200).json({ product: remapProductResponse(product) })
}
