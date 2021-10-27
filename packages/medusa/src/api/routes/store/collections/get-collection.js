/**
 * @oas [get] /collections/{id}
 * operationId: GetCollectionsCollection
 * summary: Retrieves a Collection
 * description: "Retrieves a Collection."
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 * tags:
 *   - Collection
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             collection:
 *               $ref: "#/components/schemas/product_collection"
 */
export default async (req, res) => {
  const { id } = req.params

  const collectionService = req.scope.resolve("productCollectionService")
  const collection = await collectionService.retrieve(id)

  res.json({ collection })
}
