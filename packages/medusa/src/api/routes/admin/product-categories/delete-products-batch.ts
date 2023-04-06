import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { ProductBatchProductCategory } from "../../../../types/product-category"
import { ProductCategoryService } from "../../../../services"
import { Type } from "class-transformer"
import { FindParams } from "../../../../types/common"

/**
 * @oas [delete] /admin/product-categories/{id}/products/batch
 * operationId: "DeleteProductCategoriesCategoryProductsBatch"
 * summary: "Delete Products"
 * description: "Remove a list of products from a product category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 *   - (query) expand {string} (Comma separated) Category fields to be expanded in the response.
 *   - (query) fields {string} (Comma separated) Category fields to be retrieved in the response.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteProductCategoriesCategoryProductsBatchReq"
 * x-codegen:
 *   method: removeProducts
 *   queryParams: AdminDeleteProductCategoriesCategoryProductsBatchParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.removeProducts(product_category_id, {
 *         product_ids: [
 *           {
 *             id: product_id
 *           }
 *         ]
 *       })
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/product-categories/{id}/products/batch' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "product_ids": [
 *             {
 *               "id": "{product_id}"
 *             }
 *           ]
 *       }'
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
 *           $ref: "#/components/schemas/AdminProductCategoriesCategoryRes"
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
  const validatedBody =
    req.validatedBody as AdminDeleteProductCategoriesCategoryProductsBatchReq

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (manager) => {
    return await productCategoryService.withTransaction(manager).removeProducts(
      id,
      validatedBody.product_ids.map((p) => p.id)
    )
  })

  const productCategory = await productCategoryService.retrieve(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ product_category: productCategory })
}

/**
 * @schema AdminDeleteProductCategoriesCategoryProductsBatchReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: The IDs of the products to delete from the Product Category.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a product
 *           type: string
 */
export class AdminDeleteProductCategoriesCategoryProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchProductCategory)
  product_ids: ProductBatchProductCategory[]
}

// eslint-disable-next-line max-len
export class AdminDeleteProductCategoriesCategoryProductsBatchParams extends FindParams {}
