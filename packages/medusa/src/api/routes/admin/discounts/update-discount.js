import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /discounts/{id}
 * operationId: "PostDiscountsDiscount"
 * summary: "Update a Discount"
 * description: "Updates a Discount with a given set of rules that define how the Discount behaves."
 * parameters:
 *   - (path) id=* {string} The id of the Discount.
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
  const schema = Validator.object().keys({
    code: Validator.string().optional(),
    is_dynamic: Validator.boolean().default(false),
    rule: Validator.object()
      .keys({
        id: Validator.string().required(),
        description: Validator.string().optional(),
        type: Validator.string().required(),
        value: Validator.number().required(),
        allocation: Validator.string().required(),
        valid_for: Validator.array().items(Validator.string()),
      })
      .optional(),
    is_disabled: Validator.boolean().optional(),
    starts_at: Validator.date().optional(),
    ends_at: Validator.when("starts_at", {
      not: undefined,
      then: Validator.date().greater(Validator.ref("starts_at")).optional(),
      otherwise: Validator.date().optional(),
    }),
    valid_duration: Validator.string().isoDuration().allow(null).optional(),
    usage_limit: Validator.number().positive().optional(),
    regions: Validator.array().items(Validator.string()).optional(),
  })

  const { value, error } = schema.validate(req.body)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const discountService = req.scope.resolve("discountService")
  await discountService.update(discount_id, value)

  const discount = await discountService.retrieve(discount_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ discount })
}
