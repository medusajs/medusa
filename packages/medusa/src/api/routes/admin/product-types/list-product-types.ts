import { Type } from "class-transformer"
import { MedusaError } from "medusa-core-utils"
import { IsNumber, IsString, IsOptional, ValidateNested } from "class-validator"
import { omit, pickBy, identity } from "lodash"
import {
  allowedAdminProductTypeFields,
  defaultAdminProductTypeFields,
  defaultAdminProductTypeRelations,
} from "."
import { ProductType } from "../../../../models/product-type"
import ProductTypeService from "../../../../services/product-type"
import {
  StringComparisonOperator,
  DateComparisonOperator,
  FindConfig,
} from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /product-types
 * operationId: "GetProductTypes"
 * summary: "List Product Types"
 * description: "Retrieve a list of Product Types."
 * x-authenticated: true
 * parameters:
 *   - (query) limit {string} The number of types to return.
 *   - (query) offset {string} The offset of types to return.
 *   - (query) value {string} The value of types to return.
 *   - (query) id {string} The id of types to return.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting tas was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting tas was updated, i.e. less than, greater than etc.
 * tags:
 *   - Product Tag
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            types:
 *              $ref: "#/components/schemas/product_tag"
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
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  @ValidateNested()
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
