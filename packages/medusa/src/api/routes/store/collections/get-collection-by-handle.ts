import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [get] /collections/{handle}/handle
 * operationId: "GetCollectionsCollectionByHandle"
 * summary: "Retrieve a Product Collection by handle"
 * description: "Retrieves a Product Collection by handle."
 * parameters:
 *   - (path) handle=* {string} The handle of the Product Collection
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
  const { handle } = req.params
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.retrieveByHandle(handle)
  res.status(200).json({ collection })
}
