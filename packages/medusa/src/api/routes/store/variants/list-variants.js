/**
 * @oas [get] /variants
 * operationId: GetVariants
 * summary: Retrieve Product Variants
 * description: "Retrieves a list of Product Variants"
 * parameters:
 *   - (query) ids {string} A comma separated list of Product Variant ids to filter by.
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
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  let selector = {}

  const listConfig = {
    relations: [],
    skip: offset,
    take: limit,
  }

  if ("ids" in req.query) {
    selector = { id: req.query.ids.split(",") }
  }

  const variantService = req.scope.resolve("productVariantService")
  const variants = await variantService.list(selector, listConfig)

  res.json({ variants })
}
