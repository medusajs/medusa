import { IsNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"
import { AdminProductCategoriesReqBase } from "../../../../types/product-category"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/product-categories
 * operationId: "PostProductCategories"
 * summary: "Create a Product Category"
 * description: "Creates a Product Category."
 * x-authenticated: true
 * parameters:
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the results.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in the results.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesReq"
 * x-codegen:
 *   method: create
 *   queryParams: AdminPostProductCategoriesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.create({
 *         name: "Skinny Jeans",
 *       })
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/product-categories' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Skinny Jeans",
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
  const { validatedBody } = req as {
    validatedBody: AdminPostProductCategoriesReq
  }

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await productCategoryService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const productCategory = await productCategoryService.retrieve(
    created.id,
    req.retrieveConfig
  )

  res.status(200).json({ product_category: productCategory })
}

/**
 * @schema AdminPostProductCategoriesReq
 * type: object
 * required:
 *   - name
 * properties:
 *   name:
 *     type: string
 *     description: The name to identify the Product Category by.
 *   handle:
 *     type: string
 *     description: An optional handle to be used in slugs, if none is provided we will kebab-case the title.
 *   is_internal:
 *     type: boolean
 *     description: A flag to make product category an internal category for admins
 *   is_active:
 *     type: boolean
 *     description: A flag to make product category visible/hidden in the store front
 *   parent_category_id:
 *     type: string
 *     description: The ID of the parent product category
 */
// eslint-disable-next-line max-len
export class AdminPostProductCategoriesReq extends AdminProductCategoriesReqBase {
  @IsString()
  @IsNotEmpty()
  name: string
}

export class AdminPostProductCategoriesParams extends FindParams {}
