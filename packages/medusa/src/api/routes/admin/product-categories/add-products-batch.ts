import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { ProductBatchProductCategory } from "../../../../types/product-category"
import { ProductCategoryService } from "../../../../services"
import { Type } from "class-transformer"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /product-categories/{id}/products/batch
 * operationId: "PostProductCategoriesCategoryProductsBatch"
 * summary: "Add Products to a category"
 * description: "Assign a batch of products to a product category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 *   - (query) expand {string} (Comma separated) Category fields to be expanded in the response.
 *   - (query) fields {string} (Comma separated) Category fields to be retrieved in the response.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesCategoryProductsBatchReq"
 * x-codegen:
 *   method: addProducts
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location \
 *       --request POST 'https://medusa-url.com/admin/product-categories/{product_category_id}/products/batch' \
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
 *   - Product Category
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             product_category:
 *               $ref: "#/components/schemas/ProductCategory"
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
        validatedBody.product_ids.map((p) => p.id),
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

export class AdminPostProductCategoriesCategoryProductsBatchParams extends FindParams {}
