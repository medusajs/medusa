import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /order-edits/{id}/decline
 * operationId: "PostOrderEditsOrderEditDecline"
 * summary: "Decline an OrderEdit"
 * description: "Declines an OrderEdit."
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostOrderEditsOrderEditDecline"
 * x-codegen:
 *   method: decline
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orderEdits.decline(order_edit_id)
 *         .then(({ order_edit }) => {
 *           console.log(order_edit.id);
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/order-edits/{id}/decline'
 * tags:
 *   - OrderEdit
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreOrderEditsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: StorePostOrderEditsOrderEditDecline
  }

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  const userId = req.user?.customer_id ?? req.user?.id ?? req.user?.userId

  await manager.transaction(async (manager) => {
    await orderEditService.withTransaction(manager).decline(id, {
      declinedReason: validatedBody.declined_reason,
      declinedBy: userId,
    })
  })

  let orderEdit = await orderEditService.retrieve(id, {
    select: defaultStoreOrderEditFields,
    relations: defaultStoreOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).json({ order_edit: orderEdit })
}

/**
 * @schema StorePostOrderEditsOrderEditDecline
 * type: object
 * properties:
 *   declined_reason:
 *     type: string
 *     description: The reason for declining the OrderEdit.
 */
export class StorePostOrderEditsOrderEditDecline {
  @IsOptional()
  @IsString()
  declined_reason?: string
}
