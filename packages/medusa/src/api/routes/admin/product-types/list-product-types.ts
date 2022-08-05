import {
  DateComparisonOperator,
  FindConfig,
  StringComparisonOperator,
} from "../../../../types/common"
import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  allowedAdminProductTypeFields,
  defaultAdminProductTypeFields,
  defaultAdminProductTypeRelations,
} from "."
import { identity, omit, pickBy } from "lodash"

import { IsType } from "../../../../utils/validators/is-type"
import { MedusaError } from "medusa-core-utils"
import { ProductType } from "../../../../models/product-type"
import ProductTypeService from "../../../../services/product-type"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /product-types
 * operationId: "GetProductTypes"
 * summary: "List Product Types"
 * description: "Retrieve a list of Product Types."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of types to return.
 *   - (query) offset=0 {integer} The number of items to skip before the results.
 *   - (query) order {string} The field to sort items by.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: The type values to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: The type IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} A query string to search values for
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting product types were created.
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
 *     description: Date comparison for when resulting product types were updated.
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
 * tags:
 *   - Product Type
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            product_types:
 *              $ref: "#/components/schemas/product_type"
 *            count:
 *              type: integer
 *              description: The total number of items available
 *            offset:
 *              type: integer
 *              description: The number of items skipped before these items
 *            limit:
 *              type: integer
 *              description: The number of items per page
 */
export default async (req, res) => {
  const validated = await validator(AdminGetProductTypesParams, req.query)

  const typeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  const listConfig: FindConfig<ProductType> = {
    select: defaultAdminProductTypeFields as (keyof ProductType)[],
    relations: defaultAdminProductTypeRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  if (typeof validated.order !== "undefined") {
    let orderField = validated.order
    if (validated.order.startsWith("-")) {
      const [, field] = validated.order.split("-")
      orderField = field
      listConfig.order = { [field]: "DESC" }
    } else {
      listConfig.order = { [validated.order]: "ASC" }
    }

    if (!allowedAdminProductTypeFields.includes(orderField)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order field must be a valid product type field"
      )
    }
  }

  const filterableFields = omit(validated, ["limit", "offset"])

  const [types, count] = await typeService.listAndCount(
    pickBy(filterableFields, identity),
    listConfig
  )

  res.status(200).json({
    product_types: types,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetProductTypesPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit? = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset? = 0
}

export class AdminGetProductTypesParams extends AdminGetProductTypesPaginationParams {
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
