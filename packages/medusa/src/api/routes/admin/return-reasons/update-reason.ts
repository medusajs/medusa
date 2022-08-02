import { IsOptional, IsString } from "class-validator"
import {
  defaultAdminReturnReasonsFields,
  defaultAdminReturnReasonsRelations,
} from "."
import { ReturnReasonService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /return-reasons/{id}
 * operationId: "PostReturnReasonsReason"
 * summary: "Update a Return Reason"
 * description: "Updates a Return Reason"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Return Reason.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           label:
 *             description: "The label to display to the Customer."
 *             type: string
 *           description:
 *             description: "An optional description to for the Reason."
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 * tags:
 *   - Return Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return_reason:
 *               $ref: "#/components/schemas/return_reason"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostReturnReasonsReasonReq, req.body)

  const returnReasonService: ReturnReasonService = req.scope.resolve(
    "returnReasonService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await returnReasonService
      .withTransaction(transactionManager)
      .update(id, validated)
  })

  const reason = await returnReasonService.retrieve(id, {
    select: defaultAdminReturnReasonsFields,
    relations: defaultAdminReturnReasonsRelations,
  })

  res.status(200).json({ return_reason: reason })
}

export class AdminPostReturnReasonsReasonReq {
  @IsOptional()
  @IsString()
  label?: string

  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  metadata?: Record<string, unknown>
}
