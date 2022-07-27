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
import { defaultStoreSwapFields, defaultStoreSwapRelations } from "."
import IdempotencyKeyService from "../../../../services/idempotency-key"
import OrderService from "../../../../services/order"
import ReturnService from "../../../../services/return"
import SwapService from "../../../../services/swap"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /swaps
 * operationId: PostSwaps
 * summary: Create a Swap
 * description: "Creates a Swap on an Order by providing some items to return along with some items to send back"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - order_id
 *           - return_items
 *           - additional_items
 *         properties:
 *           order_id:
 *             type: string
 *             description: The id of the Order to create the Swap for.
 *           return_items:
 *             description: "The items to include in the Return."
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item from the Order.
 *                   type: string
 *                 quantity:
 *                   description: The quantity to return.
 *                   type: integer
 *                 reason_id:
 *                   description: The id of the reason of this return
 *                   type: string
 *                 note_id:
 *                   description: The id of the note
 *                   type: string
 *           return_shipping_option:
 *             type: string
 *             description: The id of the Shipping Option to create the Shipping Method from.
 *           additional_items:
 *             description: "The items to exchange the returned items to."
 *             type: array
 *             items:
 *               required:
 *                 - variant_id
 *                 - quantity
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to send.
 *                   type: string
 *                 quantity:
 *                   description: The quantity to send of the variant.
 *                   type: integer
 *         required:
 *          - order_id
 *          - return_items
 *          - additional_items
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swap:
 *               $ref: "#/components/schemas/swap"
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
  let err = false

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        await manager.transaction(async (transactionManager) => {
          const { key, error } = await idempotencyKeyService
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

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
        })
        break
      }

      case "swap_created": {
        await manager.transaction(async (transactionManager) => {
          const { key, error } = await idempotencyKeyService
            .withTransaction(transactionManager)
            .workStage(
              idempotencyKey.idempotency_key,
              async (transactionManager: EntityManager) => {
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
