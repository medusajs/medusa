/**
 * @oas [get] /collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Retrieve a Product Collection"
 * description: "Retrieves a Product Collection."
 * parameters:
 *   - (path) id=* {string} The id of the Product Collection
 * tags:
 *   - collection
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
  const { id } = req.params
  try {
    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const collection = await productCollectionService.retrieve(id)
    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}
