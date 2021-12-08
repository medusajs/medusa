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
  const filteringSchema = Validator.object().keys({
    id: Validator.string(),
    q: Validator.string(),
    status: Validator.array()
      .items(
        Validator.string().valid(
          "pending",
          "completed",
          "archived",
          "canceled",
          "requires_action"
        )
      )
      .single(),
    fulfillment_status: Validator.array()
      .items(
        Validator.string().valid(
          "not_fulfilled",
          "fulfilled",
          "partially_fulfilled",
          "shipped",
          "partially_shipped",
          "canceled",
          "returned",
          "partially_returned",
          "requires_action"
        )
      )
      .single(),
    payment_status: Validator.array()
      .items(
        Validator.string().valid(
          "captured",
          "awaiting",
          "not_paid",
          "refunded",
          "partially_refunded",
          "canceled",
          "requires_action"
        )
      )
      .single(),
    display_id: Validator.string(),
    cart_id: Validator.string(),
    customer_id: Validator.string(),
    email: Validator.string(),
    region_id: Validator.string(),
    currency_code: Validator.string(),
    tax_rate: Validator.string(),
    canceled_at: Validator.dateFilter(),
    created_at: Validator.dateFilter(),
    updated_at: Validator.dateFilter(),
  })

  const schema = filteringSchema.keys({
    offset: Validator.string(),
    limit: Validator.string(),
    expand: Validator.string(),
    fields: Validator.string(),
  })

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
