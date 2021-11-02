/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collection:
 *              $ref: "#/components/schemas/product_collection"
 */
export default async (req, res) => {
  const selector = {}

  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const productCollectionService = req.scope.resolve("productCollectionService")

  const listConfig = {
    skip: offset,
    take: limit,
  }

  const [collections, count] = await productCollectionService.listAndCount(
    selector,
    listConfig
  )

  res.status(200).json({ collections, count })
}
