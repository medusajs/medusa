import _ from "lodash"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /shipping-options
 * operationId: "GetShippingOptions"
 * summary: "List Shipping Options"
 * description: "Retrieves a list of Shipping Options."
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_options:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const query = _.pick(req.query, ["region_id", "is_return", "admin_only"])

  const optionService = req.scope.resolve("shippingOptionService")
  const data = await optionService.list(query, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ shipping_options: data })
}
