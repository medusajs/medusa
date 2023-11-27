import { IsNotEmpty, IsString, IsObject, IsOptional } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { ProductCategoryService } from "../../../../services"
import { AdminProductCategoriesReqBase } from "../../../../types/product-category"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/product-categories
 * operationId: "PostProductCategories"
 * summary: "Create a Product Category"
 * description: "Create a Product Category."
 * x-authenticated: true
 * x-featureFlag: "product_categories"
 * parameters:
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product category.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product category.
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
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/product-categories' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Skinny Jeans"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
 *     description: The name of the product category
 *   description:
 *     type: string
 *     description: The description of the product category.
 *   handle:
 *     type: string
 *     description: The handle of the product category. If none is provided, the kebab-case version of the name will be used. This field can be used as a slug in URLs.
 *   is_internal:
 *     type: boolean
 *     description: >-
 *       If set to `true`, the product category will only be available to admins.
 *   is_active:
 *     type: boolean
 *     description: >-
 *       If set to `false`, the product category will not be available in the storefront.
 *   parent_category_id:
 *     type: string
 *     description: The ID of the parent product category
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
// eslint-disable-next-line max-len
export class AdminPostProductCategoriesReq extends AdminProductCategoriesReqBase {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostProductCategoriesParams extends FindParams {}
