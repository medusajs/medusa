import {
  DateComparisonOperator,
  FindConfig,
  StringComparisonOperator,
} from "../../../../types/common"
import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  allowedAdminProductTagsFields,
  defaultAdminProductTagsFields,
  defaultAdminProductTagsRelations,
} from "."
import { identity, omit, pickBy } from "lodash"

import { IsType } from "../../../../utils/validators/is-type"
import { MedusaError } from "medusa-core-utils"
import { ProductTag } from "../../../../models/product-tag"
import ProductTagService from "../../../../services/product-tag"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { isDefined } from "../../../../utils"

/**
 * @oas [get] /product-tags
 * operationId: "GetProductTags"
 * summary: "List Product Tags"
 * description: "Retrieve a list of Product Tags."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of tags to return.
 *   - (query) offset=0 {integer} The number of items to skip before the results.
 *   - (query) order {string} The field to sort items by.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: The tag values to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} A query string to search values for
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: The tag IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting product tags were created.
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
 *     description: Date comparison for when resulting product tags were updated.
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
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productTags.list()
 *       .then(({ product_tags }) => {
 *         console.log(product_tags.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-tags' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Tag
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            product_tags:
 *              $ref: "#/components/schemas/product_tag"
 *            count:
 *              type: integer
 *              description: The total number of items available
 *            offset:
 *              type: integer
 *              description: The number of items skipped before these items
 *            limit:
 *              type: integer
 *              description: The number of items per page
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
export default async (req, res) => {
  const validated = await validator(AdminGetProductTagsParams, req.query)

  const tagService: ProductTagService = req.scope.resolve("productTagService")

  const listConfig: FindConfig<ProductTag> = {
    select: defaultAdminProductTagsFields as (keyof ProductTag)[],
    relations: defaultAdminProductTagsRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  if (isDefined(validated.order)) {
    let orderField = validated.order
    if (validated.order.startsWith("-")) {
      const [, field] = validated.order.split("-")
      orderField = field
      listConfig.order = { [field]: "DESC" }
    } else {
      listConfig.order = { [validated.order]: "ASC" }
    }

    if (!allowedAdminProductTagsFields.includes(orderField)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order field must be a valid product tag field"
      )
    }
  }

  const filterableFields = omit(validated, ["limit", "offset"])

  const [tags, count] = await tagService.listAndCount(
    pickBy(filterableFields, identity),
    listConfig
  )

  res.status(200).json({
    product_tags: tags,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetProductTagsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

export class AdminGetProductTagsParams extends AdminGetProductTagsPaginationParams {
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  value?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  order?: string
}
