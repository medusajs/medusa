import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"
import { defaultStoreSwapFields, defaultStoreSwapRelations } from "."

import { EntityManager } from "typeorm"
import IdempotencyKeyService from "../../../../services/idempotency-key"
import { MedusaError } from "medusa-core-utils"
import OrderService from "../../../../services/order"
import ReturnService from "../../../../services/return"
import SwapService from "../../../../services/swap"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /swaps
 * operationId: PostSwaps
 * summary: Create a Swap
 * description: "Creates a Swap on an Order by providing some items to return along with some items to send back"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostSwapsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.swaps.create({
 *         order_id,
 *         return_items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ],
 *         additional_items: [
 *           {
 *             variant_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ swap }) => {
 *         console.log(swap.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/swaps' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "order_id": "asfasf",
 *           "return_items": [
 *             {
 *               "item_id": "asfas",
 *               "quantity": 1
 *             }
 *           ],
 *           "additional_items": [
 *             {
 *               "variant_id": "asfas",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreSwapsRes"
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
  const swapDto = await validator(StorePostSwapsReq, req.body)

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

  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const returnService: ReturnService = req.scope.resolve("returnService")

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
                const order = await orderService
                  .withTransaction(manager)
                  .retrieve(swapDto.order_id, {
                    select: ["refunded_total", "total"],
                    relations: [
                      "items",
                      "items.tax_lines",
                      "swaps",
                      "swaps.additional_items",
                      "swaps.additional_items.tax_lines",
                    ],
                  })

                let returnShipping
                if (swapDto.return_shipping_option) {
                  returnShipping = {
                    option_id: swapDto.return_shipping_option,
                  }
                }

                const swap = await swapService
                  .withTransaction(manager)
                  .create(
                    order,
                    swapDto.return_items,
                    swapDto.additional_items,
                    returnShipping,
                    {
                      idempotency_key: idempotencyKey.idempotency_key,
                      no_notification: true,
                    }
                  )

                await swapService.withTransaction(manager).createCart(swap.id)
                const returnOrder = await returnService
                  .withTransaction(manager)
                  .retrieveBySwap(swap.id)

                await returnService
                  .withTransaction(manager)
                  .fulfill(returnOrder.id)

                return {
                  recovery_point: "swap_created",
                }
              })
          })
          .catch((e) => {
            inProgress = false
            err = e
          })
        break
      }

      case "swap_created": {
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                const swaps = await swapService
                  .withTransaction(transactionManager)
                  .list({
                    idempotency_key: idempotencyKey.idempotency_key,
                  })

                if (!swaps.length) {
                  throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    "Swap not found"
                  )
                }

                const swap = await swapService
                  .withTransaction(transactionManager)
                  .retrieve(swaps[0].id, {
                    select: defaultStoreSwapFields,
                    relations: defaultStoreSwapRelations,
                  })

                return {
                  response_code: 200,
                  response_body: { swap },
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

class AdditionalItem {
  @IsString()
  @IsNotEmpty()
  variant_id: string

  @IsNumber()
  @Min(1)
  quantity: number
}

/**
 * @schema StorePostSwapsReq
 * type: object
 * required:
 *   - order_id
 *   - return_items
 *   - additional_items
 * properties:
 *   order_id:
 *     type: string
 *     description: The ID of the Order to create the Swap for.
 *   return_items:
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
 *           description: The quantity to swap.
 *           type: integer
 *         reason_id:
 *           description: The ID of the reason of this return.
 *           type: string
 *         note:
 *           description: The note to add to the item being swapped.
 *           type: string
 *   return_shipping_option:
 *     type: string
 *     description: The ID of the Shipping Option to create the Shipping Method from.
 *   additional_items:
 *     description: "The items to exchange the returned items to."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - variant_id
 *         - quantity
 *       properties:
 *         variant_id:
 *           description: The ID of the Product Variant to send.
 *           type: string
 *         quantity:
 *           description: The quantity to send of the variant.
 *           type: integer
 */
export class StorePostSwapsReq {
  @IsString()
  @IsNotEmpty()
  order_id: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  return_items: Item[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalItem)
  additional_items: AdditionalItem[]

  @IsOptional()
  @IsString()
  return_shipping_option?: string
}
