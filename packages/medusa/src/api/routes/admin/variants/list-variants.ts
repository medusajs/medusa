import { defaultFields, defaultRelations } from "./"
import ProductVariantService from "../../../../services/product-variant"

/**
 * @oas [get] /variants
 * operationId: "GetVariants"
 * summary: "List Product Variants."
 * description: "Retrieves a list of Product Variants"
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
  const variantService = req.scope.resolve(
    "productVariantService"
  ) as ProductVariantService

  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0

  const selector = {} as FindOptions

  if ("q" in req.query) {
    selector.q = req.query.q
  }

  const listConfig = {
    select: defaultFields,
    relations: defaultRelations,
    skip: offset,
    take: limit,
  }

  const variants = await variantService.list(selector, listConfig)

  res.json({ variants, count: variants.length, offset, limit })
}
