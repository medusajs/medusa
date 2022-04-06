import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import omit from "lodash/omit"
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"
import { FindConfig } from "../../../../types/common"
import { FilterablePriceListProps } from "../../../../types/price-list"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /price-lists
 * operationId: "GetPriceLists"
 * summary: "List Price Lists"
 * description: "Retrieves a list of Price Lists."
 * x-authenticated: true
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             price_lists:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/price_list"
 *             count:
 *               description: The number of Price Lists.
 *               type: integer
 *             offset:
 *               description: The offset of the Price List query.
 *               type: integer
 *             limit:
 *               description: The limit of the Price List query.
 *               type: integer
 */
export default async (req, res) => {
  const validated = await validator(
    AdminGetPriceListPaginationParams,
    req.query
  )

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const listConfig: FindConfig<PriceList> = {
    relations: expandFields,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" } as { [k: string]: "DESC" },
  }

  if (typeof validated.order !== "undefined") {
    if (validated.order.startsWith("-")) {
      const [, field] = validated.order.split("-")
      listConfig.order = { [field]: "DESC" }
    } else {
      listConfig.order = { [validated.order]: "ASC" }
    }
  }

  const filterableFields = omit(validated, [
    "limit",
    "offset",
    "expand",
    "order",
  ])

  const [price_lists, count] = await priceListService.listAndCount(
    filterableFields,
    listConfig
  )

  res.json({
    price_lists,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetPriceListPaginationParams extends FilterablePriceListProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  order?: string
}
