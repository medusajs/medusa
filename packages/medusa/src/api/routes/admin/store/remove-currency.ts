import { StoreService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /store/currencies/{code}
 * operationId: "DeleteStoreCurrenciesCode"
 * summary: "Remove a Currency Code"
 * description: "Removes a Currency Code from the available currencies."
 * x-authenticated: true
 * parameters:
 *   - in: path
 *     name: code
 *     required: true
 *     description: The 3 character ISO currency code.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
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
      .removeCurrency(currency_code)
  })

  res.status(200).json({ store: data })
}
