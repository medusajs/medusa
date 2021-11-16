import { defaultAdminVariantFields, defaultAdminVariantRelations } from "./"

import { FilterableProductVariantProps } from "../../../../types/product-variant"
import { FindConfig } from "../../../../types/common"
import { ProductVariant } from "../../../../models/product-variant"
import ProductVariantService from "../../../../services/product-variant"

/**
 * @oas [get] /variants
 * operationId: "GetVariants"
 * summary: "List Product Variants."
 * description: "Retrieves a list of Product Variants"
 * x-authenticated: true
 * tags:
 *   - Product Variant
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_variant"
 */
export default async (req, res) => {
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0

  const selector: FilterableProductVariantProps = {}

  if ("q" in req.query) {
    selector.q = req.query.q
  }

  const listConfig: FindConfig<ProductVariant> = {
    select: defaultAdminVariantFields,
    relations: defaultAdminVariantRelations,
    skip: offset,
    take: limit,
  }

  const variants = await variantService.list(selector, listConfig)

  res.json({ variants, count: variants.length, offset, limit })
}
