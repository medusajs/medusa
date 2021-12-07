import { IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService, IdempotencyKeyService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/shipping-methods
 * operationId: "PostCartsCartShippingMethod"
 * description: "Adds a Shipping Method to the Cart."
 * summary: "Add a Shipping Method"
 * tags:
 *   - Cart
 * parameters:
 *   - (path) id=* {String} The cart id.
 *   - (body) option_id=* {String} id of the shipping option to create the method from
 *   - (body) data {Object} Used to hold any data that the shipping method may need to process the fulfillment of the order. Look at the documentation for your installed fulfillment providers to find out what to send.
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            cart:
 *              $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    StorePostCartsCartShippingMethodReq,
    req.body
  )

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    idempotencyKey = await idempotencyKeyService.initializeRequest(
      headerKey,
      req.method,
      req.params,
      req.path
    )
  } catch (error) {
    console.log(error)
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const cartService: CartService = req.scope.resolve("cartService")

  let inProgress = true
  let err: MedusaError | null = null

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        const { key, error } = await idempotencyKeyService.workStage(
          idempotencyKey.idempotency_key,
          async (manager) => {
            const txCartService = cartService.withTransaction(manager)
            await txCartService.addShippingMethod(
              id,
              validated.option_id,
              validated.data
            )

            const updated = await txCartService.retrieve(id, {
              relations: ["payment_sessions"],
            })

            if (updated.payment_sessions?.length) {
              await txCartService.setPaymentSessions(id)
            }

            const cart = await txCartService.retrieve(id, {
              select: defaultStoreCartFields,
              relations: defaultStoreCartRelations,
            })

            return {
              response_code: 200,
              response_body: { cart },
            }
          }
        )

        if (error) {
          inProgress = false
          err = error
        } else {
          idempotencyKey = key
        }

        break
      }

      case "finished": {
        inProgress = false
        break
      }

      default:
        idempotencyKey = await idempotencyKeyService.update(
          idempotencyKey.idempotency_key,
          {
            recovery_point: "finished",
            response_code: 500,
            response_body: { message: "Unknown recovery point" },
          }
        )

        break
    }
  }

  if (err) {
    throw err
  }

  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}

export class StorePostCartsCartShippingMethodReq {
  @IsString()
  option_id: string

  @IsOptional()
  data?: object = {}
}
