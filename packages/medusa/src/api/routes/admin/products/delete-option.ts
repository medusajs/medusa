import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { EntityManager } from "typeorm"
import { ProductService } from "../../../../services"

/**
 * @oas [delete] /admin/products/{id}/options/{option_id}
 * operationId: "DeleteProductsProductOptionsOption"
 * summary: "Delete a Product Option"
 * description: "Delete a Product Option. If there are product variants that use this product option, they must be deleted before deleting the product option."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 *   - (path) option_id=* {string} The ID of the Product Option.
 * x-codegen:
 *   method: deleteOption
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.deleteOption(productId, optionId)
 *       .then(({ option_id, object, deleted, product }) => {
 *         console.log(product.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/products/{id}/options/{option_id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsDeleteOptionRes"
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
export default async (req, res) => {
  const { id, option_id } = req.params

  const productService: ProductService = req.scope.resolve("productService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService
      .withTransaction(transactionManager)
      .deleteOption(id, option_id)
  })

  const data = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({
    option_id,
    object: "option",
    deleted: true,
    product: data,
  })
}
