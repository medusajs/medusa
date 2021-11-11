import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultRelations } from "."
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { IsGreaterThan } from "../../../../utils/validators/greater-than"
import { validator } from "../../../../utils/validator"
import { IsISO8601Duration } from "../../../../utils/validators/iso8601-duration"
/**
 * @oas [post] /discounts
 * operationId: "PostDiscounts"
 * summary: "Creates a Discount"
 * x-auhtenticated: true
 * description: "Creates a Discount with a given set of rules that define how the Discount behaves."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           code:
 *             type: string
 *             description: A unique code that will be used to redeem the Discount
 *           is_dynamic:
 *             type: string
 *             description: Whether the Discount should have multiple instances of itself, each with a different code. This can be useful for automatically generated codes that all have to follow a common set of rules.
 *           rule:
 *             description: The Discount Rule that defines how Discounts are calculated
 *             oneOf:
 *               - $ref: "#/components/schemas/discount_rule"
 *           is_disabled:
 *             type: boolean
 *             description: Whether the Discount code is disabled on creation. You will have to enable it later to make it available to Customers.
 *           starts_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Discount should be available.
 *           ends_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Discount should no longer be available.
 *           regions:
 *             description: A list of Region ids representing the Regions in which the Discount can be used.
 *             type: array
 *             items:
 *               type: string
 *           usage_limit:
 *             type: number
 *             description: Maximum times the discount can be used
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
  // const schema = Validator.object().keys({
  //   code: Validator.string().required(),
  //   is_dynamic: Validator.boolean().default(false),
  //   rule: Validator.object()
  //     .keys({
  //       description: Validator.string().optional(),
  //       type: Validator.string().required(),
  //       value: Validator.number().positive().required(),
  //       allocation: Validator.string().required(),
  //       valid_for: Validator.array().items(Validator.string()),
  //     })
  //     .required(),
  //   is_disabled: Validator.boolean().default(false),
  //   starts_at: Validator.date().optional(),
  //   ends_at: Validator.date().greater(Validator.ref("starts_at")).optional(),
  //   valid_duration: Validator.string().isoDuration().allow(null).optional(),
  //   usage_limit: Validator.number().positive().optional(),
  //   regions: Validator.array().items(Validator.string()).optional(),
  //   metadata: Validator.object().optional(),
  // })

  // const { value, error } = schema.validate(req.body)

  // if (error) {
  //   throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  // }

  const validated = await validator(AdminPostDiscountsReq, req.body)

  const discountService: DiscountService = req.scope.resolve("discountService")
  const created = await discountService.create(validated)
  const discount: Discount = await discountService.retrieve(
    created.id,
    defaultRelations
  )

  res.status(200).json({ discount })
}

export class AdminPostDiscountsReq {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdminPostDiscountsDiscountRule)
  rule: AdminPostDiscountsDiscountRule

  @IsBoolean()
  @IsOptional()
  is_dynamic = false

  @IsBoolean()
  @IsOptional()
  is_disabled = false

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  starts_at: Date

  @IsDate()
  @IsOptional()
  @IsGreaterThan("starts_at")
  @Type(() => Date)
  ends_at: Date

  @IsISO8601Duration()
  @IsOptional()
  valid_duration: string

  @IsNumber()
  @IsOptional()
  @IsPositive()
  usage_limit: number

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  regions: string[]

  @IsObject()
  @IsOptional()
  metadata: object
}

export class AdminPostDiscountsDiscountRule {
  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNumber()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsNotEmpty()
  allocation: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  valid_for: string
}
