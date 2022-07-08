import ProductCollectionService from "../../../../services/product-collection"
import { defaultStoreCollectionRelations } from "./index"

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
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService",
    {
      relations: defaultStoreCollectionRelations,
    }
  )

  const collection = await productCollectionService.retrieve(id)
  res.status(200).json({ collection })
}
