import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import DiscountService from "../../../../services/discount"
import { EntityManager } from "typeorm"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /discounts/{id}/dynamic-codes
 * operationId: "PostDiscountsDiscountDynamicCodes"
 * summary: "Create a dynamic Discount code"
 * description: "Creates a unique code that can map to a parent Discount. This is useful if you want to automatically generate codes with the same behaviour."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount to create the dynamic code from."
 *   - (body) code=* {string} The unique code that will be used to redeem the Discount.
 *   - (body) usage_limit=1 {number} amount of times the discount can be applied.
 *   - (body) metadata {object} An optional set of key-value paris to hold additional information.
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  const { discount_id } = req.params

  const validated = await validator(
    AdminPostDiscountsDiscountDynamicCodesReq,
    req.body
  )

  const discountService: DiscountService = req.scope.resolve("discountService")
  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await discountService
      .withTransaction(transactionManager)
      .createDynamicCode(discount_id, validated)
  })

  const discount = await discountService.retrieve(created.id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}

export class AdminPostDiscountsDiscountDynamicCodesReq {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsNumber()
  @IsOptional()
  usage_limit = 1

  @IsObject()
  @IsOptional()
  metadata?: object
}
