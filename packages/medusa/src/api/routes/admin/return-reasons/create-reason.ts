import { IsOptional, IsString } from "class-validator"
import {
  defaultAdminReturnReasonsFields,
  defaultAdminReturnReasonsRelations,
} from "."
import { ReturnReasonService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /return-reasons
 * operationId: "PostReturnReasons"
 * summary: "Create a Return Reason"
 * description: "Creates a Return Reason"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *          - label
 *          - value
 *         properties:
 *           label:
 *             description: "The label to display to the Customer."
 *             type: string
 *           value:
 *             description: "The value that the Return Reason will be identified by. Must be unique."
 *             type: string
 *            parent_return_reason_id:
 *             description: "The id of the parent return reason."
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
  const validated = await validator(AdminPostReturnReasonsReq, req.body)

  const returnReasonService: ReturnReasonService = req.scope.resolve(
    "returnReasonService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await returnReasonService
      .withTransaction(transactionManager)
      .create(validated)
  })

  const reason = await returnReasonService.retrieve(result.id, {
    select: defaultAdminReturnReasonsFields,
    relations: defaultAdminReturnReasonsRelations,
  })

  res.status(200).json({ return_reason: reason })
}

export class AdminPostReturnReasonsReq {
  @IsString()
  value: string

  @IsString()
  label: string

  @IsOptional()
  @IsString()
  parent_return_reason_id?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  metadata?: object
}
