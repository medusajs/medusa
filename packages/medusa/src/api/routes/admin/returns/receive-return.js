import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /returns/{id}receive
 * operationId: "PostReturnsReturnReceive"
 * summary: "Receive a Return"
 * description: "Registers a Return as received. Updates statuses on Orders and Swaps accordingly."
 * parameters:
 *   - (path) id=* {string} The id of the Return.
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
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return:
 *               $ref: "#/components/schemas/return"
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
          .registerReturnReceived(
            receivedReturn.order_id,
            receivedReturn,
            refundAmount
          )
      }

      if (receivedReturn.swap_id) {
        await swapService
          .withTransaction(manager)
          .registerReceived(receivedReturn.swap_id)
      }
    })

    receivedReturn = await returnService.retrieve(id, { relations: ["swap"] })

    res.status(200).json({ return: receivedReturn })
  } catch (err) {
    throw err
  }
}
