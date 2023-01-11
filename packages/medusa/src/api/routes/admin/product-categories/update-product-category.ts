import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { ProductCategoryService } from "../../../../services"
import { AdminProductCategoriesReqBase } from "../../../../types/product-category"

/**
 * @oas [post] /product-categories/{id}
 * operationId: "PostProductCategoriesCategory"
 * summary: "Update a Product Category"
 * description: "Updates a Product Category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductCategoriesCategoryReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.update(categoryId, {
 *         name: 'Skinny Jeans'
 *       })
 *       .then(({ productCategory }) => {
 *         console.log(productCategory.id);
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
 *   - Product Category
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            productCategory:
 *              $ref: "#/components/schemas/ProductCategory"
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

  const productCategory = await productCategoryService.retrieve(updated.id)

  res.status(200).json({ product_category: productCategory })
}

/**
 * @schema AdminPostProductCategoriesCategoryReq
 * type: object
 * properties:
 *   name:
 *     type: string
 *     description:  The name to identify the Product Category by.
 *   handle:
 *     type: string
 *     description:  An optional handle to be used in slugs, if none is provided we will kebab-case the name.
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
export class AdminPostProductCategoriesCategoryReq extends AdminProductCategoriesReqBase {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  handle?: string
}
