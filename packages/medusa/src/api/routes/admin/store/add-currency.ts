import { StoreService } from "../../../../services"
/**
 * @oas [post] /store/currencies/{code}
 * operationId: "PostStoreCurrenciesCode"
 * summary: "Add a Currency Code"
 * description: "Adds a Currency Code to the available currencies."
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
  const data = await storeService.addCurrency(currency_code)
  res.status(200).json({ store: data })
}
