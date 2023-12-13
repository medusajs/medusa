import { EntityManager } from "typeorm"
import { AbstractCartCompletionStrategy } from "../../../../interfaces"
import { IdempotencyKey } from "../../../../models"
import { IdempotencyKeyService } from "../../../../services"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { Logger } from "@medusajs/types"

/**
 * @oas [post] /store/carts/{id}/complete
 * summary: "Complete a Cart"
 * operationId: "PostCartsCartComplete"
 * description: |
 *   Complete a cart and place an order or create a swap, based on the cart's type. This includes attempting to authorize the cart's payment.
 *   If authorizing the payment requires more action, the cart will not be completed and the order will not be placed or the swap will not be created.
 *
 *   An idempotency key will be generated if none is provided in the header `Idempotency-Key` and added to
 *   the response. If an error occurs during cart completion or the request is interrupted for any reason, the cart completion can be retried by passing the idempotency
 *   key in the `Idempotency-Key` header.
 * externalDocs:
 *   description: "Cart completion overview"
 *   url: "https://docs.medusajs.com/modules/carts-and-checkout/cart#cart-completion"
 * parameters:
 *   - (path) id=* {String} The Cart ID.
 * x-codegen:
 *   method: complete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.complete(cartId)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/complete'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: "If the payment of the cart was successfully authorized, but requires further
 *       action from the customer, the response body will contain the cart with an
 *       updated payment session. Otherwise, if the payment was authorized and the cart was successfully completed, the
 *       response body will contain either the newly created order or swap, depending on what the cart was created for."
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCompleteCartRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const manager: EntityManager = req.scope.resolve("manager")
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const logger: Logger = req.scope.resolve("logger")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey: IdempotencyKey
  try {
    idempotencyKey = await manager.transaction(async (transactionManager) => {
      return await idempotencyKeyService
        .withTransaction(transactionManager)
        .initializeRequest(headerKey, req.method, req.params, req.path)
    })
  } catch (error) {
    logger.log(error)
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const completionStrat: AbstractCartCompletionStrategy = req.scope.resolve(
    "cartCompletionStrategy"
  )

  const { response_code, response_body } = await completionStrat.complete(
    id,
    idempotencyKey,
    req.request_context
  )

  if (response_body.data) {
    response_body.data = cleanResponseData(response_body.data, [])
  }

  res.status(response_code).json(response_body)
}
