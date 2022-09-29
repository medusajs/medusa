import { IsBoolean, IsOptional } from "class-validator"
import { Currency } from "../../../../models"
import { ExtendedRequest } from "../../../../types/global"
import { CurrencyService } from "../../../../services"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"

/**
 * @oas [post] /currencies/{code}
 * operationId: "PostCurrenciesCurrency"
 * summary: "Update a Currency"
 * description: "Update a Currency"
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Currency.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           includes_tax:
 *             type: boolean
 *             description: "[EXPERIMENTAL] Tax included in prices of currency."
 * tags:
 *   - Currency
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             currency:
 *                 $ref: "#/components/schemas/currency"
 */
export default async (req: ExtendedRequest<Currency>, res) => {
  const code = req.params.code as string
  const data = req.validatedBody as AdminPostCurrenciesCurrencyReq
  const currencyService: CurrencyService = req.scope.resolve("currencyService")

  const currency = await currencyService.update(code, data)

  res.json({ currency })
}

export class AdminPostCurrenciesCurrencyReq {
  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
