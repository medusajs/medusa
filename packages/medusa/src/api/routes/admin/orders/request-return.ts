import {
  EventBusService,
  OrderService,
  ReturnService,
} from "../../../../services"
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { MedusaError } from "medusa-core-utils"
import { OrdersReturnItem } from "../../../../types/orders"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import { Return } from "../../../../models"
import { Order } from "../../../../models"

/**
 * @oas [post] /orders/{id}/return
 * operationId: "PostOrdersOrderReturns"
 * summary: "Request a Return"
 * description: "Requests a Return. If applicable a return label will be created and other plugins notified."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - items
 *         properties:
 *           items:
 *             description: The Line Items that will be returned.
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The ID of the Line Item.
 *                   type: string
 *                 reason_id:
 *                   description: The ID of the Return Reason to use.
 *                   type: string
 *                 note:
 *                   description: An optional note with information about the Return.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *           return_shipping:
 *             description: The Shipping Method to be used to handle the return shipment.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The ID of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           note:
 *             description: An optional note with information about the Return.
 *             type: string
 *           receive_now:
 *             description: A flag to indicate if the Return should be registerd as received immediately.
 *             type: boolean
 *             default: false
 *           no_notification:
 *             description: A flag to indicate if no notifications should be emitted related to the requested Return.
 *             type: boolean
 *           refund:
 *             description: The amount to refund.
 *             type: integer
 * tags:
 *   - Return
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params

  const value = await validator(AdminPostOrdersOrderReturnsReq, req.body)

  const idempotencyKeyService = req.scope.resolve("idempotencyKeyService")
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

  try {
    const orderService: OrderService = req.scope.resolve("orderService")
    const returnService: ReturnService = req.scope.resolve("returnService")
    const eventBus: EventBusService = req.scope.resolve("eventBusService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          await manager.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                const returnObj: ReturnObj = {
                  order_id: id,
                  idempotency_key: idempotencyKey.idempotency_key,
                  items: value.items,
                }

                if (value.return_shipping) {
                  returnObj.shipping_method = value.return_shipping
                }

                if (typeof value.refund !== "undefined" && value.refund < 0) {
                  returnObj.refund_amount = 0
                } else {
                  if (value.refund && value.refund >= 0) {
                    returnObj.refund_amount = value.refund
                  }
                }

                const order = await orderService
                  .withTransaction(manager)
                  .retrieve(id)

                const evaluatedNoNotification =
                  value.no_notification !== undefined
                    ? value.no_notification
                    : order.no_notification
                returnObj.no_notification = evaluatedNoNotification

                const createdReturn = await returnService
                  .withTransaction(manager)
                  .create(returnObj)

                if (value.return_shipping) {
                  await returnService
                    .withTransaction(manager)
                    .fulfill(createdReturn.id)
                }

                await eventBus
                  .withTransaction(manager)
                  .emit("order.return_requested", {
                    id,
                    return_id: createdReturn.id,
                    no_notification: evaluatedNoNotification,
                  })

                return {
                  recovery_point: "return_requested",
                }
              })

            if (error) {
              inProgress = false
              err = error
            } else {
              idempotencyKey = key
            }
          })
          break
        }

        case "return_requested": {
          await manager.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                let order: Order | Return = await orderService
                  .withTransaction(manager)
                  .retrieve(id, { relations: ["returns"] })

                /**
                 * If we are ready to receive immediately, we find the newly created return
                 * and register it as received.
                 */
                if (value.receive_now) {
                  const returns = await returnService
                    .withTransaction(manager)
                    .list({
                      idempotency_key: idempotencyKey.idempotency_key,
                    })

                  if (!returns.length) {
                    throw new MedusaError(
                      MedusaError.Types.INVALID_DATA,
                      `Return not found`
                    )
                  }

                  const returnOrder = returns[0]

                  order = await returnService
                    .withTransaction(manager)
                    .receive(returnOrder.id, value.items, value.refund)
                }

                order = await orderService
                  .withTransaction(manager)
                  .retrieve(id, {
                    select: defaultAdminOrdersFields,
                    relations: defaultAdminOrdersRelations,
                  })

                return {
                  response_code: 200,
                  response_body: { order },
                }
              })

            if (error) {
              inProgress = false
              err = error
            } else {
              idempotencyKey = key
            }
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

    res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
  } catch (err) {
    console.log(err)
    throw err
  }
}

type ReturnObj = {
  order_id: string
  idempotency_key?: string
  items?: OrdersReturnItem[]
  shipping_method?: ReturnShipping
  refund_amount?: number
  no_notification?: boolean
}

export class AdminPostOrdersOrderReturnsReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersReturnItem)
  items: OrdersReturnItem[]

  @IsOptional()
  @ValidateNested()
  @Type(() => ReturnShipping)
  return_shipping?: ReturnShipping

  @IsString()
  @IsOptional()
  note?: string

  @IsBoolean()
  @IsOptional()
  receive_now?: boolean = false

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean

  @IsInt()
  @IsOptional()
  refund?: number
}

class ReturnShipping {
  @IsString()
  @IsOptional()
  option_id?: string

  @IsInt()
  @IsOptional()
  price?: number
}
