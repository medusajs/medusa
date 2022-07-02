import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { identity, omit, pickBy } from "lodash"
import { MedusaError } from "medusa-core-utils"
import {
  allowedAdminProductTagsFields,
  defaultAdminProductTagsFields,
  defaultAdminProductTagsRelations,
} from "."
import { ProductTag } from "../../../../models/product-tag"
import ProductTagService from "../../../../services/product-tag"
import {
  DateComparisonOperator,
  FindConfig,
  StringComparisonOperator,
} from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /product-tags
 * operationId: "GetProductTags"
 * summary: "List Product Tags"
 * description: "Retrieve a list of Product Tags."
 * x-authenticated: true
 * parameters:
 *   - (query) limit {string} The number of tags to return.
 *   - (query) offset {string} The offset of tags to return.
 *   - (query) value {string} The value of tags to return.
 *   - (query) id {string} The id of tags to return.
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
 *            tags:
 *              $ref: "#/components/schemas/product_tag"
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

  if (typeof validated.order !== "undefined") {
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
