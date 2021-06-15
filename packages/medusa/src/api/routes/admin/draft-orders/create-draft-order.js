import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "."

/**
 * @oas [post] /draft-orders
 * operationId: "PostDraftOrders"
 * summary: "Create a Draft Order"
 * description: "Creates a Draft Order"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           status:
 *             description: "The status of the draft order"
 *             type: string
 *           email:
 *             description: "The email of the customer of the draft order"
 *             type: string
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           items:
 *             description: The Line Items that have been received.
 *             type: array
 *             items:
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to generate the Line Item from.
 *                   type: string
 *                 unit_price:
 *                   description: The potential custom price of the item.
 *                   type: integer
 *                 title:
 *                   description: The potential custom title of the item.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *                 metadata:
 *                   description: The optional key-value map with additional details about the Line Item.
 *                   type: object
 *           region_id:
 *             description: The id of the region for the draft order
 *             type: string
 *           discounts:
 *             description: The discounts to add on the draft order
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: The code of the discount to apply
 *                   type: string
 *           customer_id:
 *             description: The id of the customer to add on the draft order
 *             type: string
 *           no_notification_order:
 *             description: An optional flag passed to the resulting order to determine use of notifications.
 *             type: boolean
 *           shipping_methods:
 *             description: The shipping methods for the draft order
 *             type: array
 *             items:
 *               properties:
 *                 option_id:
 *                   description: The id of the shipping option in use
 *                   type: string
 *                 data:
 *                   description: The optional additional data needed for the shipping method
 *                   type: object
 *                 price:
 *                   description: The potential custom price of the shipping
 *                   type: integer
 *           metadata:
 *             description: The optional key-value map with additional details about the Draft Order.
 *             type: object
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
 */

export default async (req, res) => {
  const schema = Validator.object().keys({
    status: Validator.string()
      .valid("open", "completed")
      .optional(),
    email: Validator.string()
      .email()
      .required(),
    billing_address: Validator.address().optional(),
    shipping_address: Validator.address().optional(),
    items: Validator.array()
      .items({
        variant_id: Validator.string()
          .optional()
          .allow(""),
        unit_price: Validator.number().optional(),
        title: Validator.string()
          .optional()
          .allow(""),
        quantity: Validator.number().required(),
        metadata: Validator.object().default({}),
      })
      .required(),
    region_id: Validator.string().required(),
    discounts: Validator.array()
      .items({
        code: Validator.string().required(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
    no_notification_order: Validator.boolean().optional(),
    shipping_methods: Validator.array()
      .items({
        option_id: Validator.string().required(),
        data: Validator.object().optional(),
        price: Validator.number()
          .integer()
          .integer()
          .allow(0)
          .optional(),
      })
      .required(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    let draftOrder = await draftOrderService.create(value)

    draftOrder = await draftOrderService.retrieve(draftOrder.id, {
      relations: defaultRelations,
      select: defaultFields,
    })

    res.status(200).json({ draft_order: draftOrder })
  } catch (err) {
    throw err
  }
}
