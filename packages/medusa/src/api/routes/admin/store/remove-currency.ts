import { StoreService } from "../../../../services"

/**
 * @oas [delete] /store/currencies/{code}
 * operationId: "DeleteStoreCurrenciesCode"
 * summary: "Remvoe a Currency Code"
 * description: "Removes a Currency Code from the available currencies."
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The 3 character ISO currency code.
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             store:
 *               $ref: "#/components/schemas/store"
 */
export default async (req, res) => {
  const { currency_code } = req.params

  const storeService: StoreService = req.scope.resolve("storeService")
  const data = await storeService.removeCurrency(currency_code)
  res.status(200).json({ store: data })
}
