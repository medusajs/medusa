import { IsBoolean, IsOptional, IsString } from "class-validator"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { Currency } from "../../../../models"
import { CurrencyService } from "../../../../services"
import { FindPaginationParams } from "../../../../types/common"
import { ExtendedRequest } from "../../../../types/global"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"

/**
 * @oas [get] /admin/currencies
 * operationId: "GetCurrencies"
 * summary: "List Currency"
 * description: "Retrieves a list of Currency"
 * x-authenticated: true
 * parameters:
 *   - (query) code {string} Code of the currency to search for.
 *   - (query) includes_tax {boolean} Search for tax inclusive currencies.
 *   - (query) order {string} order to retrieve products in.
 *   - (query) offset=0 {number} How many products to skip in the result.
 *   - (query) limit=20 {number} Limit the number of products returned.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetCurrenciesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.currencies.list()
 *       .then(({ currencies, count, offset, limit }) => {
 *         console.log(currencies.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/currencies' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Currencies
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCurrenciesListRes"
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

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsBoolean(),
    IsOptional(),
  ])
  includes_tax?: boolean

  @IsString()
  @IsOptional()
  order?: string
}
