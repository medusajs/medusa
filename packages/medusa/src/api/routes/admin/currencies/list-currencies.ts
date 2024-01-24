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
 *   - (query) q {string} Term used to search currencies' name and code.
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCurrencies } from "medusa-react"
 *
 *       const Currencies = () => {
 *         const { currencies, isLoading } = useAdminCurrencies()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {currencies && !currencies.length && (
 *               <span>No Currencies</span>
 *             )}
 *             {currencies && currencies.length > 0 && (
 *               <ul>
 *                 {currencies.map((currency) => (
 *                   <li key={currency.code}>{currency.name}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Currencies
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/currencies' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Currencies
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCurrenciesListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
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

/**
 * Parameters used to filter and configure the pagination of the retrieved currencies.
 */
export class AdminGetCurrenciesParams extends FindPaginationParams {
  /**
   * Code to filter currencies by.
   */
  @IsString()
  @IsOptional()
  code?: string

  /**
   * Search parameter for currencies.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Filter currencies by whether they include tax.
   *
   * @featureFlag tax_inclusive_pricing
   */
  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsBoolean(),
    IsOptional(),
  ])
  includes_tax?: boolean

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   * By default, the returned currencies will be sorted by their `created_at` field.
   */
  @IsString()
  @IsOptional()
  order?: string
}
