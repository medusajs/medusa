import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /returns/{id}/cancel
 * operationId: "PostReturnsReturnCancel"
 * summary: "Cancel a Return"
 * description: "Registers a Return as canceled."
 * parameters:
 *   - (path) id=* {string} The id of the Return.
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

  try {
    const returnService = req.scope.resolve("returnService")

    const result = await returnService.cancel(id)

    res.status(200).json({ return: result })
  } catch (err) {
    throw err
  }
}
