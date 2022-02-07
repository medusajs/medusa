import { IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
/**
  * @oas [post] /collections/{id}/products
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
 *           addProductIds:
 *             description: "An array of Product IDs to add to the Product Collection."
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: "The ID of a Product to add to the Product Collection."
 *                   type: string
 *           removeProductIds:
 *             description: "An array of Product IDs to remove from the Product Collection."
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: "The ID of a Product to remove from the Product Collection."
 *                   type: string
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req, res) => {
  const { id } = req.params
    
  const validated = await validator(AdminPostProductsToCollectionParams, req.body)

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.updateProducts(id, validated.addProductIds, validated.removeProductIds)

  res.status(200).json({ collection })
}

export class AdminPostProductsToCollectionParams {
  @IsOptional()
  @IsString({each: true})
  addProductIds: string[]

  @IsOptional()
  @IsString({each: true})
  removeProductIds: string[]
}
