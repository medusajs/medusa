import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import { PricingService } from "../../../../services"

/**
 * @oas [post] /admin/products/{id}/metadata
 * operationId: "PostProductsProductMetadata"
 * summary: "Set Product Metadata"
 * description: "Set metadata key/value pair for Product"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductMetadataReq"
 * x-codegen:
 *   method: setMetadata
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.setMetadata(product_id, {
 *       key: 'test',
 *         value: 'true'
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products/{id}/metadata' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "key": "test",
 *           "value": "true"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Products
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
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductMetadataReq,
    req.body
  )

  const productService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).update(id, {
      metadata: { [validated.key]: validated.value },
    })
  })

  const rawProduct = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  const [product] = await pricingService.setProductPrices([rawProduct])

  res.status(200).json({ product })
}

/**
 * @schema AdminPostProductsProductMetadataReq
 * type: object
 * required:
 *   - key
 *   - value
 * properties:
 *   key:
 *     description: The metadata key
 *     type: string
 *   value:
 *     description: The metadata value
 *     type: string
 */
export class AdminPostProductsProductMetadataReq {
  @IsString()
  key: string

  @IsString()
  value: string
}
