import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import omit from "lodash/omit"
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"
import { FindConfig } from "../../../../types/common"
import { FilterablePriceListProps } from "../../../../types/price-list"
import { validator } from "../../../../utils/validator"
import { Request } from "express"
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
export default async (req: Request, res) => {
  const validated = req.validatedQuery

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const [price_lists, count] = await priceListService.listAndCount(
    req.filterableFields,
    req.listConfig
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
