import { IsBoolean, IsOptional } from "class-validator"
import { Currency } from "../../../../models"
import { ExtendedRequest } from "../../../../types/global"
import { CurrencyService } from "../../../../services"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/currencies/{code}
 * operationId: "PostCurrenciesCurrency"
 * summary: "Update a Currency"
 * description: "Update a Currency's details."
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Currency.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCurrenciesCurrencyReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.currencies.update(code, {
 *         includes_tax: true
 *       })
 *       .then(({ currency }) => {
 *         console.log(currency.code);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/currencies/{code}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "includes_tax": true
 *       }'
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
 *           $ref: "#/components/schemas/AdminCurrenciesRes"
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
  const code = req.params.code as string
  const data = req.validatedBody as AdminPostCurrenciesCurrencyReq
  const currencyService: CurrencyService = req.scope.resolve("currencyService")
  const manager: EntityManager = req.scope.resolve("manager")

  const currency = await manager.transaction(async (transactionManager) => {
    return await currencyService
      .withTransaction(transactionManager)
      .update(code, data)
  })

  res.json({ currency })
}

/**
 * @schema AdminPostCurrenciesCurrencyReq
 * type: object
 * properties:
 *   includes_tax:
 *     type: boolean
 *     x-featureFlag: "tax_inclusive_pricing"
 *     description: "Tax included in prices of currency."
 */
export class AdminPostCurrenciesCurrencyReq {
  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
