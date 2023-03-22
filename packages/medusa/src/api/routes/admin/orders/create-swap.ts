import {
  IdempotencyKeyService,
  OrderService,
  ReturnService,
  SwapService,
} from "../../../../services"
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { Type } from "class-transformer"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /order/{id}/swaps
 * operationId: "PostOrdersOrderSwaps"
 * summary: "Create a Swap"
 * description: "Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded the order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included the order of the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderSwapsReq"
 * x-codegen:
 *   method: createSwap
 *   queryParams: AdminPostOrdersOrderSwapsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createSwap(order_id, {
 *         return_items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "return_items": [
 *             {
 *               "item_id": "asfasf",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
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

  const validated = req.validatedBody

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const returnService: ReturnService = req.scope.resolve("returnService")
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
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                const order = await orderService
                  .withTransaction(manager)
                  .retrieveWithTotals(id, {
                    relations: [
                      "cart",
                      "items",
                      "items.tax_lines",
                      "swaps",
                      "swaps.additional_items",
                      "swaps.additional_items.tax_lines",
                    ],
                  })

                const swap = await swapService
                  .withTransaction(manager)
                  .create(
                    order,
                    validated.return_items,
                    validated.additional_items,
                    validated.return_shipping,
                    {
                      idempotency_key: idempotencyKey.idempotency_key,
                      no_notification: validated.no_notification,
                      allow_backorder: validated.allow_backorder,
                    }
                  )

                await swapService
                  .withTransaction(manager)
                  .createCart(swap.id, validated.custom_shipping_options)

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

                const order = await orderService
                  .withTransaction(transactionManager)
                  .retrieveWithTotals(id, req.retrieveConfig, {
                    includes: req.includes,
                  })

                return {
                  response_code: 200,
                  response_body: {
                    order: cleanResponseData(order, []),
                  },
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

/**
 * @schema AdminPostOrdersOrderSwapsReq
 * type: object
 * required:
 *   - return_items
 * properties:
 *   return_items:
 *     description: The Line Items to return as part of the Swap.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - item_id
 *         - quantity
 *       properties:
 *         item_id:
 *           description: The ID of the Line Item that will be claimed.
 *           type: string
 *         quantity:
 *           description: The number of items that will be returned
 *           type: integer
 *         reason_id:
 *           description: The ID of the Return Reason to use.
 *           type: string
 *         note:
 *           description: An optional note with information about the Return.
 *           type: string
 *   return_shipping:
 *     description: How the Swap will be returned.
 *     type: object
 *     required:
 *       - option_id
 *     properties:
 *       option_id:
 *         type: string
 *         description: The ID of the Shipping Option to create the Shipping Method from.
 *       price:
 *         type: integer
 *         description: The price to charge for the Shipping Method.
 *   additional_items:
 *     description: The new items to send to the Customer.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - variant_id
 *         - quantity
 *       properties:
 *         variant_id:
 *           description: The ID of the Product Variant to ship.
 *           type: string
 *         quantity:
 *           description: The quantity of the Product Variant to ship.
 *           type: integer
 *   custom_shipping_options:
 *     description: The custom shipping options to potentially create a Shipping Method from.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - option_id
 *         - price
 *       properties:
 *         option_id:
 *           description: The ID of the Shipping Option to override with a custom price.
 *           type: string
 *         price:
 *           description: The custom price of the Shipping Option.
 *           type: integer
 *   no_notification:
 *     description: If set to true no notification will be send related to this Swap.
 *     type: boolean
 *   allow_backorder:
 *     description: If true, swaps can be completed with items out of stock
 *     type: boolean
 *     default: true
 */
export class AdminPostOrdersOrderSwapsReq {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReturnItem)
  return_items: ReturnItem[]

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ReturnShipping)
  return_shipping?: ReturnShipping

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionalItem)
  additional_items?: AdditionalItem[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomShippingOption)
  custom_shipping_options?: CustomShippingOption[] = []

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean = true
}

class ReturnItem {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number

  @IsOptional()
  @IsString()
  reason_id?: string

  @IsOptional()
  @IsString()
  note?: string
}

class ReturnShipping {
  @IsString()
  @IsNotEmpty()
  option_id: string

  @IsInt()
  @IsOptional()
  price?: number
}

class CustomShippingOption {
  @IsString()
  @IsNotEmpty()
  option_id: string

  @IsInt()
  @IsNotEmpty()
  price: number
}

class AdditionalItem {
  @IsString()
  @IsNotEmpty()
  variant_id: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number
}

export class AdminPostOrdersOrderSwapsParams extends FindParams {}
