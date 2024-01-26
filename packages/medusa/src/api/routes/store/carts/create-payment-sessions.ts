import { CartService } from "../../../../services"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import IdempotencyKeyService from "../../../../services/idempotency-key"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { setVariantAvailability } from "./create-line-item/utils/handler-steps"
import { WithRequiredProperty } from "../../../../types/common"
import { Cart } from "../../../../models"

/**
 * @oas [post] /store/carts/{id}/payment-sessions
 * operationId: "PostCartsCartPaymentSessions"
 * summary: "Create Payment Sessions"
 * description: "Create Payment Sessions for each of the available Payment Providers in the Cart's Region. If there's only one payment session created,
 *  it will be selected by default. The creation of the payment session uses the payment provider and may require sending requests to third-party services."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 * x-codegen:
 *   method: createPaymentSessions
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.createPaymentSessions(cartId)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useCreatePaymentSession } from "medusa-react"
 *
 *       type Props = {
 *         cartId: string
 *       }
 *
 *       const Cart = ({ cartId }: Props) => {
 *         const createPaymentSession = useCreatePaymentSession(cartId)
 *
 *         const handleComplete = () => {
 *           createPaymentSession.mutate(void 0, {
 *             onSuccess: ({ cart }) => {
 *               console.log(cart.payment_sessions)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default Cart
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/payment-sessions'
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

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    await manager.transaction(async (transactionManager) => {
      idempotencyKey = await idempotencyKeyService
        .withTransaction(transactionManager)
        .initializeRequest(headerKey, req.method, req.params, req.path)
    })
  } catch (error) {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  let inProgress = true
  let err: unknown = false

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        try {
          const cartService: CartService = req.scope.resolve("cartService")
          const getCart = async () => {
            return await cartService
              .withTransaction(manager)
              .retrieveWithTotals(
                id,
                {
                  select: defaultStoreCartFields,
                  relations: [
                    ...defaultStoreCartRelations,
                    "region.tax_rates",
                    "customer",
                  ],
                },
                { force_taxes: true }
              )
          }

          const cart = await getCart()

          await manager.transaction(async (transactionManager) => {
            const txCartService =
              cartService.withTransaction(transactionManager)
            await txCartService.setPaymentSessions(
              cart as WithRequiredProperty<Cart, "total">
            )
          })

          const freshCart = await getCart()
          await setVariantAvailability({
            cart: freshCart,
            container: req.scope,
            manager,
          })

          idempotencyKey = await idempotencyKeyService
            .withTransaction(manager)
            .update(idempotencyKey.idempotency_key, {
              recovery_point: "finished",
              response_code: 200,
              response_body: { cart: freshCart },
            })
        } catch (e) {
          inProgress = false
          err = e
        }
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
    idempotencyKey.response_body.data = cleanResponseData(
      idempotencyKey.response_body.cart,
      []
    )
  }
  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}
