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
 * description: |
 *   Retrieve a list of Product Variants associated with a Product. The variants can be paginated.
 *
 *   By default, each variant will only have the `id` and `variant_id` fields. You can use the `expand` and `fields` request parameters to retrieve more fields or relations.
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} ID of the product.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product variants.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product variants.
 *   - (query) offset=0 {integer} The number of product variants to skip when retrieving the product variants.
 *   - (query) limit=100 {integer} Limit the number of product variants returned.
 * x-codegen:
 *   method: listVariants
 *   queryParams: AdminGetProductsVariantsParams
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/products/{id}/variants' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
