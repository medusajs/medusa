import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { ProductBatchProductCategory } from "../../../../types/product-category"
import { ProductCategoryService } from "../../../../services"
import { Type } from "class-transformer"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/product-categories/{id}/products/batch
 * operationId: "PostProductCategoriesCategoryProductsBatch"
 * summary: "Add Products to a Category"
 * description: "Add a list of products to a product category."
 * x-authenticated: true
 * x-featureFlag: "product_categories"
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product category.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product category.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesCategoryProductsBatchReq"
 * x-codegen:
 *   method: addProducts
 *   queryParams: AdminPostProductCategoriesCategoryProductsBatchParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.addProducts(productCategoryId, {
 *         product_ids: [
 *           {
 *             id: productId
 *           }
 *         ]
 *       })
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/product-categories/{id}/products/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
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
 *   - jwt_token: []
 * tags:
 *   - Product Categories
 * responses:
 *   200:
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
export default async (req: Request, res: Response): Promise<void> => {
  const validatedBody =
    req.validatedBody as AdminPostProductCategoriesCategoryProductsBatchReq

  const { id } = req.params

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productCategoryService
      .withTransaction(transactionManager)
      .addProducts(
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
 * @schema AdminPostProductCategoriesCategoryProductsBatchReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: The IDs of the products to add to the Product Category
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the product
 */
export class AdminPostProductCategoriesCategoryProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchProductCategory)
  product_ids: ProductBatchProductCategory[]
}

// eslint-disable-next-line max-len
export class AdminPostProductCategoriesCategoryProductsBatchParams extends FindParams {}
