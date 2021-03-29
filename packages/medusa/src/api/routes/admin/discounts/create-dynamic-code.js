import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /discounts/{id}/dynamic-codes
 * operationId: "PostDiscountsDiscountDynamicCodes"
 * summary: "Create a dynamic Discount code"
 * description: "Creates a unique code that can map to a parent Discount. This is useful if you want to automatically generate codes with the same behaviour."
 * parameters:
 *   - (path) id=* {string} The id of the Discount to create the dynamic code from."
 *   - (body) code=* {string} The unique code that will be used to redeem the Discount.
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

  const schema = Validator.object().keys({
    code: Validator.string().required(),
    usage_limit: Validator.number().default(1),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const discountService = req.scope.resolve("discountService")
    await discountService.createDynamicCode(discount_id, value)

    const discount = await discountService.retrieve(discount_id, {
      relations: ["rule", "rule.valid_for", "regions"],
    })

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}
