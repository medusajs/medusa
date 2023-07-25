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
 * description: "Retrieve a list of currencies. The currencies can be filtered by fields such as `code`. The currencies can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) code {string} filter by currency code.
 *   - in: query
 *     name: includes_tax
 *     description: filter currencies by whether they include taxes or not.
 *     schema:
 *       type: boolean
 *       x-featureFlag: "tax_inclusive_pricing"
 *   - (query) order {string} A field to sort order the retrieved currencies by.
 *   - (query) offset=0 {number} The number of currencies to skip when retrieving the currencies.
 *   - (query) limit=20 {number} The number of currencies to return.
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
 *       curl -X POST 'https://medusa-url.com/admin/currencies' \
 *       -H 'Authorization: Bearer {api_token}'
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
