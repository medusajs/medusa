import {
  defaultRelations,
  defaultFields,
  allowedFields,
  allowedRelations,
} from "../orders"
import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_methods:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const schema = Validator.orderFilter()
  const filteringSchema = Validator.orderFilteringFields()

  const { value, error } = schema.validate(req.query)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const id = req.user.customer_id

  const orderService = req.scope.resolve("orderService")

  const { value: selector } = filteringSchema.validate(value, {
    stripUnknown: true,
  })

  selector.customer_id = id

  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  let includeFields = []
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
    includeFields = includeFields.filter((f) => allowedFields.includes(f))
  }

  let expandFields = []
  if ("expand" in req.query) {
    expandFields = req.query.expand.split(",")
    expandFields = expandFields.filter((f) => allowedRelations.includes(f))
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [orders, count] = await orderService.listAndCount(selector, listConfig)

  res.json({ orders, count, offset, limit })
}
