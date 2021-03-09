import _ from "lodash"
import { defaultFields, defaultRelations } from "./"

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
  try {
    const variantService = req.scope.resolve("productVariantService")

    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    let variants = await variantService.list(selector, listConfig)

    res.json({ variants, count: variants.length, offset, limit })
  } catch (error) {
    throw error
  }
}
