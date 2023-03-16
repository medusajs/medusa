import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"

import { Type } from "class-transformer"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import EventBusService from "../../../../services/event-bus"
import IdempotencyKeyService from "../../../../services/idempotency-key"
import ReturnService from "../../../../services/return"
import { validator } from "../../../../utils/validator"
import { defaultRelations } from "."

/**
 * @oas [post] /store/returns
 * operationId: "PostReturns"
 * summary: "Create Return"
 * description: "Creates a Return for an Order."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostReturnsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.returns.create({
 *         order_id,
 *         items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then((data) => {
 *         console.log(data.return.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/returns' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "order_id": "asfasf",
 *           "items": [
 *             {
 *               "item_id": "assfasf",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * tags:
 *   - Returns
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreReturnsRes"
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
  const returnDto = await validator(StorePostReturnsReq, req.body)

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

  try {
    const returnService: ReturnService = req.scope.resolve("returnService")
    const eventBus: EventBusService = req.scope.resolve("eventBusService")

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
                })
            })
            .catch((e) => {
              inProgress = false
              err = e
            })
          break
        }

        case "return_requested": {
          await manager
            .transaction("SERIALIZABLE", async (transactionManager) => {
              idempotencyKey = await idempotencyKeyService
                .withTransaction(transactionManager)
                .workStage(idempotencyKey.idempotency_key, async (manager) => {
                  const returnOrders = await returnService
                    .withTransaction(manager)
                    .list(
                      {
                        idempotency_key: idempotencyKey.idempotency_key,
                      },
                      {
                        relations: defaultRelations,
                      }
                    )
                  if (!returnOrders.length) {
                    throw new MedusaError(
                      MedusaError.Types.INVALID_DATA,
                      `Return not found`
                    )
                  }
                  const returnOrder = returnOrders[0]

                  return {
                    response_code: 200,
                    response_body: { return: returnOrder },
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

/**
 * @schema StorePostReturnsReq
 * type: object
 * required:
 *   - order_id
 *   - items
 * properties:
 *   order_id:
 *     type: string
 *     description: The ID of the Order to create the Return from.
 *   items:
 *     description: "The items to include in the Return."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - item_id
 *         - quantity
 *       properties:
 *         item_id:
 *           description: The ID of the Line Item from the Order.
 *           type: string
 *         quantity:
 *           description: The quantity to return.
 *           type: integer
 *         reason_id:
 *           description: The ID of the return reason.
 *           type: string
 *         note:
 *           description: A note to add to the item returned.
 *           type: string
 *   return_shipping:
 *     description: If the Return is to be handled by the store operator the Customer can choose a Return Shipping Method. Alternatvely the Customer can handle the Return themselves.
 *     type: object
 *     required:
 *       - option_id
 *     properties:
 *       option_id:
 *         type: string
 *         description: The ID of the Shipping Option to create the Shipping Method from.
 */
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
