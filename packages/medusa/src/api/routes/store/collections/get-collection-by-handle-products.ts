import ProductCollectionService from "../../../../services/product-collection"
import { allStoreCollectionRelations } from "./index"

/**
 * @oas [get] /collections/{handle}/handle/products
 * operationId: "GetCollectionsCollectionByHandleProducts"
 * summary: "Retrieve a Product Collection by handle with Products"
 * description: "Retrieves a Product Collection by handle with Products."
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
  const { id } = req.params
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.retrieveByHandle(id, {
    relations: allStoreCollectionRelations,
  })

  res.status(200).json({ collection })
}
