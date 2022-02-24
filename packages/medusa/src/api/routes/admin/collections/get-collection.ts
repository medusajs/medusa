import { defaultAdminCollectionsRelations } from "."
import ProductCollectionService from "../../../../services/product-collection"
import { Request } from "@interfaces/http"
/**
 * @oas [get] /collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Retrieve a Product Collection"
 * description: "Retrieves a Product Collection."
 * x-authenticated: true
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
export default async (req: Request, res) => {
  const { id } = req.params

  const retrieveConfig = {
    relations: defaultAdminCollectionsRelations,
  }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.retrieve(id, retrieveConfig)
  res.status(200).json({ collection })
}
