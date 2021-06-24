import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/refunds
 * operationId: "PostOrdersOrderRefunds"
 * summary: "Create a Refund"
 * description: "Issues a Refund."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - amount
 *           - reason
 *         properties:
 *           amount:
 *             description: The amount to refund.
 *             type: integer
 *           reason:
 *             description: The reason for the Refund.
 *             type: string
 *           note:
 *             description: A not with additional details about the Refund.
 *             type: string
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params
  const schema = Validator.object().keys({
    amount: Validator.number()
      .integer()
      .required(),
    reason: Validator.string().required(),
    note: Validator.string()
      .allow("")
      .optional(),
    no_notification: Validator.boolean().optional(),
  })

  const { value, error } = schema.validate(req.body)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.createRefund(id, value.amount, value.reason, value.note, value.no_notification)

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
