import { ICartCompletionStrategy } from "../../../../interfaces"
import { IdempotencyKeyService } from "../../../../services"
import { IdempotencyKey } from "../../../../models/idempotency-key"
import { EntityManager } from "typeorm";

/**
 * @oas [post] /carts/{id}/complete
 * summary: "Complete a Cart"
 * operationId: "PostCartsCartComplete"
 * description: "Completes a cart. The following steps will be performed. Payment
 *   authorization is attempted and if more work is required, we simply return
 *   the cart for further updates. If payment is authorized and order is not yet
 *   created, we make sure to do so. The completion of a cart can be performed
 *   idempotently with a provided header `Idempotency-Key`. If not provided, we
 *   will generate one for the request."
 * parameters:
 *   - (path) id=* {String} The Cart id.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "If a cart was successfully authorized, but requires further
 *       action from the user the response body will contain the cart with an
 *       updated payment session. If the Cart was successfully completed the
 *       response body will contain the newly created Order."
 *     content:
 *       application/json:
 *         schema:
 *           oneOf:
 *            - type: object
 *              properties:
 *                order:
 *                  $ref: "#/components/schemas/order"
 *            - type: object
 *              properties:
 *                cart:
 *                  $ref: "#/components/schemas/cart"
 *            - type: object
 *              properties:
 *                cart:
 *                  $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const { id } = req.params

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey: IdempotencyKey
  try {
    const manager: EntityManager = req.scope.resolve("manager")
    idempotencyKey = await manager.transaction(async (transactionManager) => {
      return await idempotencyKeyService.withTransaction(transactionManager).initializeRequest(
        headerKey,
        req.method,
        req.params,
        req.path
      )
    })
  } catch (error) {
    console.log(error)
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const completionStrat: ICartCompletionStrategy = req.scope.resolve(
    "cartCompletionStrategy"
  )

  const { response_code, response_body } = await completionStrat.complete(
    id,
    idempotencyKey,
    req.request_context
  )

  res.status(response_code).json(response_body)
}
