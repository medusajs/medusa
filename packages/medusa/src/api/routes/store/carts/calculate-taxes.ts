import { CartService, IdempotencyKeyService } from "../../../../services"

import { EntityManager } from "typeorm"
import { IdempotencyKey } from "../../../../models/idempotency-key"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { Logger } from "@medusajs/types"

/**
 * @oas [post] /store/carts/{id}/taxes
 * operationId: "PostCartsCartTaxes"
 * summary: "Calculate Cart Taxes"
 * description: "Calculate the taxes for a cart. This is useful if the `automatic_taxes` field of the cart's region is set to `false`. If the cart's region uses a tax provider other than
 *  Medusa's system provider, this may lead to sending requests to third-party services."
 * externalDocs:
 *   description: "How to calculate taxes manually during checkout"
 *   url: "https://docs.medusajs.com/modules/taxes/storefront/manual-calculation"
 * parameters:
 *   - (path) id=* {String} The Cart ID.
 * x-codegen:
 *   method: calculateTaxes
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/taxes'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
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

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
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

  const cartService: CartService = req.scope.resolve("cartService")

  let inProgress = true
  let err: unknown = false

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                const cart = await cartService
                  .withTransaction(manager)
                  .retrieveWithTotals(id, {}, { force_taxes: true })

                return {
                  response_code: 200,
                  response_body: { cart },
                }
              })
          })
          .catch((e) => {
            inProgress = false
            err = e
          })
        break
      }

      case "finished": {
        inProgress = false
        break
      }

      default:
        await manager.transaction(async (transactionManager) => {
          idempotencyKey = await idempotencyKeyService
            .withTransaction(transactionManager)
            .update(idempotencyKey.idempotency_key, {
              recovery_point: "finished",
              response_code: 500,
              response_body: { message: "Unknown recovery point" },
            })
        })
        break
    }
  }

  if (err) {
    throw err
  }

  if (idempotencyKey.response_body.cart) {
    idempotencyKey.response_body.cart = cleanResponseData(
      idempotencyKey.response_body.cart,
      []
    )
  }

  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}
