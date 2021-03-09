import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /order/{id}/claims/{claim_id}
 * operationId: "PostOrdersOrderClaimsClaim"
 * summary: "Update a Claim"
 * description: "Updates a Claim."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) claim_id=* {string} The id of the Claim.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           claim_items:
 *             description: The Claim Items that the Claim will consist of.
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: The id of the Claim Item.
 *                   type: string
 *                 item_id:
 *                   description: The id of the Line Item that will be claimed.
 *                   type: string
 *                 quantity:
 *                   description: The number of items that will be returned
 *                   type: integer
 *                 note:
 *                   description: Short text describing the Claim Item in further detail.
 *                   type: string
 *                 reason:
 *                   description: The reason for the Claim
 *                   type: string
 *                   enum:
 *                     - missing_item
 *                     - wrong_item
 *                     - production_failure
 *                     - other
 *                 tags:
 *                   description: A list o tags to add to the Claim Item
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   description: A list of image URL's that will be associated with the Claim
 *                   items:
 *                     type: string
 *           shipping_methods:
 *             description: The Shipping Methods to send the additional Line Items with.
 *             type: array
 *             items:
 *                properties:
 *                  id:
 *                    description: The id of an existing Shipping Method
 *                    type: string
 *                  option_id:
 *                    description: The id of the Shipping Option to create a Shipping Method from
 *                    type: string
 *                  price:
 *                    description: The price to charge for the Shipping Method
 *                    type: integer
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
  const { id, claim_id } = req.params

  const schema = Validator.object().keys({
    claim_items: Validator.array()
      .items({
        id: Validator.string().required(),
        note: Validator.string().allow(null, ""),
        reason: Validator.string().allow(null, ""),
        images: Validator.array().items({
          id: Validator.string().optional(),
          url: Validator.string().optional(),
        }),
        tags: Validator.array().items({
          id: Validator.string().optional(),
          value: Validator.string().optional(),
        }),
        metadata: Validator.object().optional(),
      })
      .optional(),
    shipping_methods: Validator.array()
      .items({
        id: Validator.string().optional(),
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const claimService = req.scope.resolve("claimService")

    await claimService.update(claim_id, value)

    const data = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order: data })
  } catch (error) {
    throw error
  }
}
