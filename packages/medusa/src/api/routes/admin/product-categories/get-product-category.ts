import { Request, Response } from "express"

import ProductCategoryService from "../../../../services/product-category"
import { FindParams } from "../../../../types/common"
import { defaultAdminProductCategoryRelations } from "."

/**
 * @oas [get] /product-categories/{id}
 * operationId: "GetProductCategoriesCategory"
 * summary: "Get a Product Category"
 * description: "Retrieves a Product Category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the results.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the results.
 * x-codegen:
 *   method: retrieve
 *   queryParams: AdminGetProductCategoryParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.retrieve(product_category_id)
 *       .then(({ product_category }) => {
 *         console.log(product_category.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-categories/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const productCategory = await productCategoryService.retrieve(id, {
    relations: defaultAdminProductCategoryRelations,
  })

  res.status(200).json({ product_category: productCategory })
}

export class AdminGetProductCategoryParams extends FindParams {}
