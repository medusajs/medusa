import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"

/**
 * @oas [delete] /admin/product-categories/{id}
 * operationId: "DeleteProductCategoriesCategory"
 * summary: "Delete a Product Category"
 * description: "Deletes a ProductCategory."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category
 * x-codegen:
 *   method: delete
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
 *   - Product Categories
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductCategoriesCategoryDeleteRes"
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
    object: "product-category",
    deleted: true,
  })
}
