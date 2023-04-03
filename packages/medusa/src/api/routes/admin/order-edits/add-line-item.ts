import { Request, Response } from "express"
import { IsInt, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"

import { OrderEditService } from "../../../../services"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /admin/order-edits/{id}/items
 * operationId: "PostOrderEditsEditLineItems"
 * summary: "Add a Line Item"
 * description: "Create an OrderEdit LineItem."
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrderEditsEditLineItemsReq"
 * x-authenticated: true
 * x-codegen:
 *   method: addLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.addLineItem(order_edit_id, {
 *         variant_id,
 *         quantity
 *       })
 *       .then(({ order_edit }) => {
 *          console.log(order_edit.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits/{id}/items' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{ "variant_id": "variant_01G1G5V2MRX2V3PVSR2WXYPFB6", "quantity": 3 }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order Edits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderEditsRes"
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
export default async (req: Request, res: Response) => {
  const orderEditService = req.scope.resolve(
    "orderEditService"
  ) as OrderEditService

  const { id } = req.params

  const manager = req.scope.resolve("manager") as EntityManager

  const data = req.validatedBody as AdminPostOrderEditsEditLineItemsReq

  await manager.transaction(async (transactionManager) => {
    await orderEditService
      .withTransaction(transactionManager)
      .addLineItem(id, data)
  })

  let orderEdit = await orderEditService.retrieve(id, {
    select: defaultOrderEditFields,
    relations: defaultOrderEditRelations,
  })

  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).send({
    order_edit: orderEdit,
  })
}

/**
 * @schema AdminPostOrderEditsEditLineItemsReq
 * type: object
 * required:
 *   - variant_id
 *   - quantity
 * properties:
 *   variant_id:
 *     description: The ID of the variant ID to add
 *     type: string
 *   quantity:
 *     description: The quantity to add
 *     type: number
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
export class AdminPostOrderEditsEditLineItemsReq {
  @IsString()
  variant_id: string

  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
