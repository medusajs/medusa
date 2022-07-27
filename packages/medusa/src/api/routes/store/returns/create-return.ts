import { Type } from "class-transformer"
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"
import { MedusaError } from "medusa-core-utils"
import EventBusService from "../../../../services/event-bus"
import IdempotencyKeyService from "../../../../services/idempotency-key"
import OrderService from "../../../../services/order"
import ReturnService from "../../../../services/return"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm";

/**
 * @oas [post] /returns
 * operationId: "PostReturns"
 * summary: "Create Return"
 * description: "Creates a Return for an Order."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           order_id:
 *             type: string
 *             description: The id of the Order to create the Return from.
 *           items:
 *             description: "The items to include in the Return."
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item from the Order.
 *                   type: string
 *                 quantity:
 *                   description: The quantity to return.
 *                   type: integer
 *               required:
 *                 - item_id
 *                 - quantity
 *           return_shipping:
 *             description: If the Return is to be handled by the store operator the Customer can choose a Return Shipping Method. Alternatvely the Customer can handle the Return themselves.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The id of the Shipping Option to create the Shipping Method from.
 *             required:
 *               - option_id
 *         required:
 *           - order_id
 *           - items
 * tags:
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return:
 *               $ref: "#/components/schemas/return"
 */
export default async (req, res) => {
  const returnDto = await validator(StorePostReturnsReq, req.body)

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    await manager.transaction(async (transactionManager) => {
      idempotencyKey = await idempotencyKeyService.withTransaction(transactionManager).initializeRequest(
        headerKey,
        req.method,
        req.params,
        req.path
      )
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
              .workStage(
                idempotencyKey.idempotency_key,
                async (manager) => {
                  const order = await orderService
                    .withTransaction(manager)
                    .retrieve(returnDto.order_id, {
                      select: ["refunded_total", "total"],
                      relations: ["items"],
                    })

                  const returnObj: any = {
                    order_id: returnDto.order_id,
                    idempotency_key: idempotencyKey.idempotency_key,
                    items: returnDto.items,
                  }

                  if (returnDto.return_shipping) {
                    returnObj.shipping_method = returnDto.return_shipping
                  }

                  const createdReturn = await returnService
                    .withTransaction(manager)
                    .create(returnObj)

                  if (returnDto.return_shipping) {
                    await returnService
                      .withTransaction(manager)
                      .fulfill(createdReturn.id)
                  }

                  await eventBus
                    .withTransaction(manager)
                    .emit("order.return_requested", {
                      id: returnDto.order_id,
                      return_id: createdReturn.id,
                    })

                  return {
                    recovery_point: "return_requested",
                  }
                }
              )

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
              .workStage(
                idempotencyKey.idempotency_key,
                async (manager) => {
                  let ret = await returnService.withTransaction(manager).list(
                    {
                      idempotency_key: idempotencyKey.idempotency_key,
                    },
                    {
                      relations: ["items", "items.reason"],
                    }
                  )
                  if (!ret.length) {
                    throw new MedusaError(
                      MedusaError.Types.INVALID_DATA,
                      `Return not found`
                    )
                  }
                  ret = ret[0]

                  return {
                    response_code: 200,
                    response_body: { return: ret },
                  }
                }
              )

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
              .update(
                idempotencyKey.idempotency_key,
                {
                  recovery_point: "finished",
                  response_code: 500,
                  response_body: { message: "Unknown recovery point" },
                }
              )
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

class ReturnShipping {
  @IsString()
  @IsNotEmpty()
  option_id: string
}

class Item {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsNumber()
  @Min(1)
  quantity: number

  @IsOptional()
  @IsString()
  reason_id?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class StorePostReturnsReq {
  @IsString()
  @IsNotEmpty()
  order_id: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[]

  @IsOptional()
  @ValidateNested()
  @Type(() => ReturnShipping)
  return_shipping?: ReturnShipping
}
