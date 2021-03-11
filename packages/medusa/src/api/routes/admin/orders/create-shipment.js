import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/shipment
 * operationId: "PostOrdersOrderShipment"
 * summary: "Create a Shipment"
 * description: "Registers a Fulfillment as shipped."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           fulfillment_id:
 *             description: The id of the Fulfillment.
 *             type: string
 *           tracking_numbers:
 *             description: The tracking numbers for the shipment.
 *             type: array
 *             items:
 *               type: string
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
    fulfillment_id: Validator.string().required(),
    tracking_numbers: Validator.array()
      .items(Validator.string())
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.createShipment(
      id,
      value.fulfillment_id,
      value.tracking_numbers.map(n => ({ tracking_number: n }))
    )

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}
