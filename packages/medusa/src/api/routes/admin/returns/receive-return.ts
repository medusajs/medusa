import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { OrderService, ReturnService, SwapService } from "../../../../services"

import { EntityManager } from "typeorm"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { isDefined } from "../../../../utils"

/**
 * @oas [post] /returns/{id}/receive
 * operationId: "PostReturnsReturnReceive"
 * summary: "Receive a Return"
 * description: "Registers a Return as received. Updates statuses on Orders and Swaps accordingly."
 * parameters:
 *   - (path) id=* {string} The ID of the Return.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - items
 *         properties:
 *           items:
 *             description: The Line Items that have been received.
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The ID of the Line Item.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *           refund:
 *             description: The amount to refund.
 *             type: number
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.returns.receive(return_id, {
 *         items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ return }) => {
 *         console.log(return.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/returns/{id}/receive' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "items": [
 *             {
 *               "item_id": "asafg",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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

  const validated = await validator(AdminPostReturnsReturnReceiveReq, req.body)

  const returnService: ReturnService = req.scope.resolve("returnService")
  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  let receivedReturn
  await entityManager.transaction(async (manager) => {
    let refundAmount = validated.refund

    if (isDefined(validated.refund) && validated.refund < 0) {
      refundAmount = 0
    }

    receivedReturn = await returnService
      .withTransaction(manager)
      .receive(id, validated.items, refundAmount, true)

    if (receivedReturn.order_id) {
      await orderService
        .withTransaction(manager)
        .registerReturnReceived(
          receivedReturn.order_id,
          receivedReturn,
          refundAmount
        )
    }

    if (receivedReturn.swap_id) {
      await swapService
        .withTransaction(manager)
        .registerReceived(receivedReturn.swap_id)
    }
  })

  receivedReturn = await returnService.retrieve(id, { relations: ["swap"] })

  res.status(200).json({ return: receivedReturn })
}

class Item {
  @IsString()
  item_id: string

  @IsNumber()
  quantity: number
}

export class AdminPostReturnsReturnReceiveReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[]

  @IsOptional()
  @IsNumber()
  refund?: number
}
