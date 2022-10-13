import { IsInt, IsOptional, IsString } from "class-validator"
import { defaultAdminVariantFields, defaultAdminVariantRelations } from "./"

import { FilterableProductVariantProps } from "../../../../types/product-variant"
import { FindConfig } from "../../../../types/common"
import { InventoryItemDTO } from "../../../../types/inventory"
import { ProductVariant } from "../../../../models/product-variant"
import ProductVariantService from "../../../../services/product-variant"
import ProductVariantInventoryService from "../../../../services/product-variant-inventory"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /variants
 * operationId: "GetVariants"
 * summary: "List Product Variants"
 * description: "Retrieves a list of Product Variants"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching variants.
 *   - (query) offset=0 {integer} How many variants to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of variants returned.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.variants.list()
 *       .then(({ variants, limit, offset, count }) => {
 *         console.log(variants.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/variants' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Variant
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_variant"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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
export default async (req, res) => {
  const variantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const { offset, limit, q } = await validator(
    AdminGetVariantsParams,
    req.query
  )

  const selector: FilterableProductVariantProps = {}

  if ("q" in req.query) {
    selector.q = q
  }

  const listConfig: FindConfig<ProductVariant> = {
    select: defaultAdminVariantFields,
    relations: defaultAdminVariantRelations,
    skip: offset,
    take: limit,
  }

  const [variants, count] = await variantService.listAndCount(
    selector,
    listConfig
  )

  const result = await Promise.all(
    variants.map(async (variant: ProductVariant): Promise<ResponseVariant> => {
      const responseVariant: ResponseVariant = { ...variant, inventory: [] }
      responseVariant.inventory =
        await variantInventoryService.listInventoryItemsByVariant(variant.id)
      return responseVariant
    })
  )

  res.json({ variants: result, count, offset, limit })
}

type ResponseVariant = Partial<ProductVariant> & {
  inventory: InventoryItemDTO[]
}

export class AdminGetVariantsParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
