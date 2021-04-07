import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /orders/{id}/returns/{return_id}/receive
 * operationId: "PostOrdersOrderReturnsReturnReceive"
 * summary: "Receive a Return"
 * description: "Registers a Return as received."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) return_id=* {string} The id of the Return.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           items:
 *             description: The Line Items that have been received.
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *           refund:
 *             description: The amount to refund.
 *             type: integer
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
    refund: Validator.number()
      .integer()
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const returnService = req.scope.resolve("returnService")
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")
    const entityManager = req.scope.resolve("manager")

    let receivedReturn
    await entityManager.transaction(async manager => {
      let refundAmount = value.refund

      if (typeof value.refund !== "undefined" && value.refund < 0) {
        refundAmount = 0
      }

      receivedReturn = await returnService
        .withTransaction(manager)
        .receive(id, value.items, refundAmount, true)

      if (receivedReturn.order_id) {
        await orderService
          .withTransaction(manager)
          .registerReturnReceived(receivedReturn.order_id, receivedReturn)
      }

      if (receivedReturn.swap_id) {
        await swapService
          .withTransaction(manager)
          .registerSwapReceived(id, receivedReturn.swap_id)
      }
    })

    receivedReturn = await returnService.retrieve(id)

    res.status(200).json({ return: receivedReturn })
  } catch (err) {
    throw err
  }
}
