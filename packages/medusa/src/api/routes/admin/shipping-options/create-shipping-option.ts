import { Type } from "class-transformer"
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultFields, defaultRelations } from "."
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /shipping-options
 * operationId: "PostShippingOptions"
 * summary: "Create Shipping Option"
 * description: "Creates a Shipping Option"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Shipping Option"
 *             type: string
 *           region_id:
 *             description: "The id of the Region in which the Shipping Option will be available."
 *             type: string
 *           provider_id:
 *             description: "The id of the Fulfillment Provider that handles the Shipping Option."
 *             type: string
 *           profile_id:
 *             description: "The id of the Shipping Profile to add the Shipping Option to."
 *             type: number
 *           data:
 *             description: "The data needed for the Fulfillment Provider to handle shipping with this Shipping Option."
 *             type: object
 *           price_type:
 *             description: "The type of the Shipping Option price."
 *             type: string
 *             enum:
 *               - flat_rate
 *               - calculated
 *           amount:
 *             description: "The amount to charge for the Shipping Option."
 *             type: integer
 *           requirements:
 *             description: "The requirements that must be satisfied for the Shipping Option to be available."
 *             type: array
 *             items:
 *               properties:
 *                 type:
 *                   description: The type of the requirement
 *                   type: string
 *                   enum:
 *                     - max_subtotal
 *                     - min_subtotal
 *                 amount:
 *                   description: The amount to compare with.
 *                   type: integer
 *           is_return:
 *             description: Whether the Shipping Option defines a return shipment.
 *             type: boolean
 *           admin_only:
 *             description: If true, the option can be used for draft orders
 *             type: boolean
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
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
  const validated = await validator(AdminPostShippingOptionsReq, req.body)

  const optionService = req.scope.resolve("shippingOptionService")
  const shippingProfileService = req.scope.resolve("shippingProfileService")

  // Add to default shipping profile
  if (!validated.profile_id) {
    const { id } = await shippingProfileService.retrieveDefault()
    validated.profile_id = id
  }

  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await optionService
      .withTransaction(transactionManager)
      .create(validated)
  })

  const data = await optionService.retrieve(result.id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ shipping_option: data })
}

class OptionRequirement {
  @IsString()
  type: string
  @IsNumber()
  amount: number
}

export class AdminPostShippingOptionsReq {
  @IsString()
  name: string

  @IsString()
  region_id: string

  @IsString()
  provider_id: string

  @IsOptional()
  @IsString()
  profile_id?: string

  @IsObject()
  data: object

  @IsString()
  price_type: string

  @IsOptional()
  @IsNumber()
  amount?: number

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionRequirement)
  requirements?: OptionRequirement[]

  @IsOptional()
  @Type(() => Boolean)
  admin_only?: boolean = false

  @IsOptional()
  @Type(() => Boolean)
  is_return?: boolean = false

  @IsObject()
  @IsOptional()
  metadata?: object
}
