import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"

/**
 * @oas [delete] /product-categories/{id}
 * operationId: "DeleteProductCategoriesCategory"
 * summary: "Delete a Product Category"
 * description: "Deletes a ProductCategory."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.delete(product_category_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/product-categories/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Category
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted product category.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: product_category
 *             deleted:
 *               type: boolean
 *               description: Whether the product category was deleted successfully or not.
 *               default: true
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    return await productCategoryService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id: id,
    object: "product_category",
    deleted: true,
  })
}
