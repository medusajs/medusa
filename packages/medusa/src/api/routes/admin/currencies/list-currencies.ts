import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Currency } from "../../../../models"
import { CurrencyService } from "../../../../services"
import { ExtendedRequest } from "../../../../types/global"
import { FindConfig, FindPaginationParams } from "../../../../types/common"

/**
 * @oas [get] /currencies
 * operationId: "GetCurrencies"
 * summary: "List Currency"
 * description: "Retrieves a list of Currency"
 * x-authenticated: true
 * parameters:
 *   - (query) code {string} Code of the currency to search for.
 *   - (query) includes_tax {boolean} Search for tax inclusive currencies.
 *   - (query) order {string} to retrieve products in.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
 * tags:
 *   - Currency
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The number of Currency.
 *               type: integer
 *             offset:
 *               description: The offset of the Currency query.
 *               type: integer
 *             limit:
 *               description: The limit of the currency query.
 *               type: integer
 *             currencies:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/currency"
 */
export default async (req: ExtendedRequest<Currency>, res) => {
  const currencyService: CurrencyService = req.scope.resolve("currencyService")

  const { skip, take } = req.listConfig

  req.listConfig.select = undefined
  if (req.listConfig.order && req.listConfig.order["created_at"]) {
    delete req.listConfig.order["created_at"]
  }
  const [currencies, count] = await currencyService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  res.json({
    currencies,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetCurrenciesParams extends FindPaginationParams {
  @IsString()
  @IsOptional()
  code?: string

  @IsBoolean()
  @IsOptional()
  includes_tax?: boolean

  @IsString()
  @IsOptional()
  order?: string
}
