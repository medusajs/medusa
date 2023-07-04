import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /admin/order-edits
 * operationId: "PostOrderEdits"
 * summary: "Create an OrderEdit"
 * description: "Creates an OrderEdit."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrderEditsReq"
 * x-authenticated: true
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.create({ order_id })
 *         .then(({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{ "order_id": "my_order_id", "internal_note": "my_optional_note" }'
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
  const manager = req.scope.resolve("manager") as EntityManager

  const data = req.validatedBody as AdminPostOrderEditsReq
  const createdBy = (req.user?.id ?? req.user?.userId) as string

  const createdOrderEdit = await manager.transaction(
    async (transactionManager) => {
      return await orderEditService
        .withTransaction(transactionManager)
        .create(data, { createdBy })
    }
  )

  let orderEdit = await orderEditService.retrieve(createdOrderEdit.id, {
    select: defaultOrderEditFields,
    relations: defaultOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  return res.json({ order_edit: orderEdit })
}

/**
 * @schema AdminPostOrderEditsReq
 * type: object
 * required:
 *   - order_id
 * properties:
 *   order_id:
 *     description: The ID of the order to create the edit for.
 *     type: string
 *   internal_note:
 *     description: An optional note to create for the order edit.
 *     type: string
 */
export class AdminPostOrderEditsReq {
  @IsString()
  order_id: string

  @IsOptional()
  @IsString()
  internal_note?: string

  @IsOptional()
  @IsString()
  created_by?: string
}
