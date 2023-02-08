import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { IsString } from "class-validator"
import { ProductService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /products/{id}/options/{option_id}
 * operationId: "PostProductsProductOptionsOption"
 * summary: "Update a Product Option"
 * description: "Updates a Product Option"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 *   - (path) option_id=* {string} The ID of the Product Option.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductOptionsOption"
 * x-codegen:
 *   method: updateOption
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.updateOption(product_id, option_id, {
 *         title: 'Size'
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products/{id}/options/{option_id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Size"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsRes"
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

  const validated = await validator(
    AdminPostProductsProductOptionsOption,
    req.body
  )

  const productService: ProductService = req.scope.resolve("productService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService
      .withTransaction(transactionManager)
      .updateOption(id, option_id, validated)
  })

  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({ product })
}

/**
 * @schema AdminPostProductsProductOptionsOption
 * type: object
 * required:
 *   - title
 * properties:
 *   title:
 *     description: "The title of the Product Option"
 *     type: string
 */
export class AdminPostProductsProductOptionsOption {
  @IsString()
  title: string
}
