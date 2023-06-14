import { IsOptional, IsString, IsInt, Min, IsNotEmpty } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"
import { AdminProductCategoriesReqBase } from "../../../../types/product-category"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/product-categories/{id}
 * operationId: "PostProductCategoriesCategory"
 * summary: "Update a Product Category"
 * description: "Updates a Product Category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product category.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in each product category.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesCategoryReq"
 * x-codegen:
 *   method: update
 *   queryParams: AdminPostProductCategoriesCategoryParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.update(productCategoryId, {
 *         name: "Skinny Jeans"
 *       })
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/product-categories/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Skinny Jeans"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Categories
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminProductCategoriesCategoryRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostProductCategoriesCategoryReq
  }

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const updated = await manager.transaction(async (transactionManager) => {
    return await productCategoryService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  const productCategory = await productCategoryService.retrieve(
    updated.id,
    req.retrieveConfig
  )

  res.status(200).json({ product_category: productCategory })
}

/**
 * @schema AdminPostProductCategoriesCategoryReq
 * type: object
 * properties:
 *   name:
 *     type: string
 *     description:  The name to identify the Product Category by.
 *   description:
 *     type: string
 *     description: An optional text field to describe the Product Category by.
 *   handle:
 *     type: string
 *     description:  A handle to be used in slugs.
 *   is_internal:
 *     type: boolean
 *     description: A flag to make product category an internal category for admins
 *   is_active:
 *     type: boolean
 *     description: A flag to make product category visible/hidden in the store front
 *   parent_category_id:
 *     type: string
 *     description: The ID of the parent product category
 *   rank:
 *     type: number
 *     description: The rank of the category in the tree node (starting from 0)
 */
// eslint-disable-next-line max-len
export class AdminPostProductCategoriesCategoryReq extends AdminProductCategoriesReqBase {
  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  handle?: string

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  rank?: number
}

export class AdminPostProductCategoriesCategoryParams extends FindParams {}
