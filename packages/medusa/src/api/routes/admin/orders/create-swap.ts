import { Type } from "class-transformer"
import {
  Min,
  IsOptional,
  IsArray,
  IsString,
  IsBoolean,
  IsObject,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."
import {
  IdempotencyKeyService,
  OrderService,
  ReturnService,
  SwapService,
} from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /order/{id}/swaps
 * operationId: "PostOrdersOrderSwaps"
 * summary: "Create a Swap"
 * description: "Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - return_items
 *         properties:
 *           return_items:
 *             description: The Line Items to return as part of the Swap.
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item that will be claimed.
 *                   type: string
 *                 quantity:
 *                   description: The number of items that will be returned
 *                   type: integer
 *           return_shipping:
 *             description: How the Swap will be returned.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The id of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           additional_items:
 *             description: The new items to send to the Customer.
 *             type: array
 *             items:
 *               required:
 *                 - variant_id
 *                 - quantity
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to ship.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Product Variant to ship.
 *                   type: integer
 *           custom_shipping_options:
 *             description: The custom shipping options to potentially create a Shipping Method from.
 *             type: array
 *             items:
 *               required:
 *                 - option_id
 *                 - price
 *               properties:
 *                 option_id:
 *                   description: The id of the Shipping Option to override with a custom price.
 *                   type: string
 *                 price:
 *                   description: The custom price of the Shipping Option.
 *                   type: integer
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 *           allow_backorder:
 *             description: If true, swaps can be completed with items out of stock
 *             type: boolean
 * tags:
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

  const validated = await validator(AdminPostOrdersOrderSwapsReq, req.body)

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
        const { key, error } = await idempotencyKeyService.workStage(
          idempotencyKey.idempotency_key,
          async (manager) => {
            const order = await orderService
              .withTransaction(manager)
              .retrieve(id, {
                select: ["refunded_total", "total"],
                relations: [
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

            await returnService.withTransaction(manager).fulfill(returnOrder.id)

            return {
              recovery_point: "swap_created",
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

      case "swap_created": {
        const { key, error } = await idempotencyKeyService.workStage(
          idempotencyKey.idempotency_key,
          async (manager) => {
            const swaps = await swapService.list({
              idempotency_key: idempotencyKey.idempotency_key,
            })

            if (!swaps.length) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Swap not found"
              )
            }

            const order = await orderService.retrieve(id, {
              select: defaultAdminOrdersFields,
              relations: defaultAdminOrdersRelations,
            })

            return {
              response_code: 200,
              response_body: { order },
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
