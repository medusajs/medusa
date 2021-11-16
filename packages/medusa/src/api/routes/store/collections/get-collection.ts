import ProductCollectionService from "../../../../services/product-collection"
/**
 * @oas [get] /collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Retrieve a Product Collection"
 * description: "Retrieves a Product Collection."
 * parameters:
 *   - (path) id=* {string} The id of the Product Collection
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
  const { id } = req.params
<<<<<<< HEAD:packages/medusa/src/api/routes/store/collections/get-collection.ts
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )
=======
  const productCollectionService = req.scope.resolve("productCollectionService")
>>>>>>> added ListAndCount:packages/medusa/src/api/routes/store/collections/get-collection.js

  const collection = await productCollectionService.retrieve(id)
  res.status(200).json({ collection })
}
