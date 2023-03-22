import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { ProductVariant } from "../../../../models"
import { ProductVariantService } from "../../../../services"
import { Type } from "class-transformer"
import { defaultAdminGetProductsVariantsFields } from "./index"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/products/{id}/variants
 * operationId: "GetProductsProductVariants"
 * summary: "List a Product's Variants"
 * description: "Retrieves a list of the Product Variants associated with a Product."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} ID of the product to search for the variants.
 *   - (query) fields {string} Comma separated string of the column to select.
 *   - (query) expand {string} Comma separated string of the relations to include.
 *   - (query) offset=0 {integer} How many items to skip before the results.
 *   - (query) limit=100 {integer} Limit the number of items returned.
 * x-codegen:
 *   method: listVariants
 *   queryParams: AdminGetProductsVariantsParams
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/products/{id}/variants' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminProductsListVariantsRes"
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

  const { expand, fields, limit, offset } = await validator(
    AdminGetProductsVariantsParams,
    req.query
  )

  const queryConfig = getRetrieveConfig<ProductVariant>(
    defaultAdminGetProductsVariantsFields as (keyof ProductVariant)[],
    [],
    [
      ...new Set([
        ...defaultAdminGetProductsVariantsFields,
        ...(fields?.split(",") ?? []),
      ]),
    ] as (keyof ProductVariant)[],
    expand ? expand?.split(",") : undefined
  )

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const [variants, count] = await productVariantService.listAndCount(
    {
      product_id: id,
    },
    {
      ...queryConfig,
      skip: offset,
      take: limit,
    }
  )

  res.json({
    count,
    variants,
    offset,
    limit,
  })
}

export class AdminGetProductsVariantsParams {
  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100
}
