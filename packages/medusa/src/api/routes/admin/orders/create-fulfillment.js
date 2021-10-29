import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/fulfillments
 * operationId: "PostOrdersOrderFulfillments"
 * summary: "Create a Fulfillment"
 * description: "Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           items:
 *             description: The Line Items to include in the Fulfillment.
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of Line Item to fulfill.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item to fulfill.
 *                   type: integer
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    no_notification: Validator.boolean().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const orderService = req.scope.resolve("orderService")

  await orderService.createFulfillment(id, value.items, {
    metadata: value.metadata,
    no_notification: value.no_notification,
  })

  const order = await orderService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ order })
}
