import { ArrayNotEmpty, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /collections/{id}/products/batch
 * operationId: "PostProductsToCollection"
 * summary: "Updates products associated with a Product Collection"
 * description: "Updates products associated with a Product Collection"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           product_ids:
 *             description: "An array of Product IDs to add to the Product Collection."
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: "The ID of a Product to add to the Product Collection."
 *                   type: string
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostProductsToCollectionReq, req.body)

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.addProducts(
    id,
    validated.product_ids
  )

  res.status(200).json({ collection })
}

export class AdminPostProductsToCollectionReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[]
}
