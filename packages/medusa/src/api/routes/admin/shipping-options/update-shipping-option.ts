import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultFields, defaultRelations } from "."

import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /shipping-options/{id}
 * operationId: "PostShippingOptionsOption"
 * summary: "Update Shipping Option"
 * description: "Updates a Shipping Option"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Option.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - requirements
 *         properties:
 *           name:
 *             description: "The name of the Shipping Option"
 *             type: string
 *           amount:
 *             description: "The amount to charge for the Shipping Option."
 *             type: integer
 *           admin_only:
 *             description: "If true, the option can be used for draft orders"
 *             type: boolean
 *           metadata:
 *             description: "An optional set of key-value pairs with additional information."
 *             type: object
 *           requirements:
 *             description: "The requirements that must be satisfied for the Shipping Option to be available."
 *             type: array
 *             items:
 *               required:
 *                 - type
 *                 - amount
 *               properties:
 *                 id:
 *                   description: The ID of the requirement
 *                   type: string
 *                 type:
 *                   description: The type of the requirement
 *                   type: string
 *                   enum:
 *                     - max_subtotal
 *                     - min_subtotal
 *                 amount:
 *                   description: The amount to compare with.
 *                   type: integer
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_option:
 *               $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const { option_id } = req.params

  const validated = await validator(AdminPostShippingOptionsOptionReq, req.body)

  const optionService = req.scope.resolve("shippingOptionService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await optionService
      .withTransaction(transactionManager)
      .update(option_id, validated)
  })

  const data = await optionService.retrieve(option_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ shipping_option: data })
}

class OptionRequirement {
  @IsString()
  @IsOptional()
  id: string
  @IsString()
  type: string
  @IsNumber()
  amount: number
}

export class AdminPostShippingOptionsOptionReq {
  @IsString()
  @IsOptional()
  name: string

  @IsNumber()
  @IsOptional()
  amount?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionRequirement)
  requirements: OptionRequirement[]

  @IsBoolean()
  @IsOptional()
  admin_only?: boolean

  @IsObject()
  @IsOptional()
  metadata?: object
}
