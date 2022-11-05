import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import ProductOptionService from "../../../../services/product-option"
import { StringComparisonOperator } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /product-options
 * operationId: GetProductOptions
 * summary: List Product Options
 * description: "Retrieves a list of Product Options."
 * parameters:
 *   - (query) q {string} Query used for searching product options by title
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: product option IDs to search for.
 *     schema:
 *       oneOf:
 *         - type: string
 *         - type: array
 *           items:
 *             type: string
 *   - (query) title {string} title to search for.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting product options were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting product options were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} How many product options to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of product options returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each order of the result.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.productOptions.list()
 *       .then(({ product_options, limit, offset, count }) => {
 *         console.log(product_options.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/product-options'
 * tags:
 *   - ProductOption
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: "#/components/schemas/product_option"
 *                   - type: object
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
  const optionService: ProductOptionService = req.scope.resolve(
    "productOptionService"
  )

  const { listConfig, filterableFields } = req
  const { skip, take } = req.listConfig

  const [productOptions, count] = await optionService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    product_options: productOptions,
    count,
    offset: skip,
    limit: take,
  })
}

export class StoreGetProductOptionsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit? = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset? = 0
}

// eslint-disable-next-line max-len
export class StoreGetProductOptionsParams extends StoreGetProductOptionsPaginationParams {
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  title?: string | string[] | StringComparisonOperator

  @IsString()
  @IsOptional()
  order?: string
}
