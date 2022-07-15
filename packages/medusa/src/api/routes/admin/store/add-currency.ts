import { StoreService } from "../../../../services"
import { EntityManager } from "typeorm"
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
  const manager: EntityManager = req.scope.resolve("manager")
  const data = await manager.transaction(async (transactionManager) => {
    return await storeService
      .withTransaction(transactionManager)
      .addCurrency(currency_code)
  })

  res.status(200).json({ store: data })
}
