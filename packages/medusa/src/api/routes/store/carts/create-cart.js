import reqIp from "request-ip"
import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /carts
 * summary: "Create a Cart"
 * operationId: "PostCart"
 * description: "Creates a Cart within the given region and with the initial items. If no
 *   `region_id` is provided the cart will be associated with the first Region
 *   available. If no items are provided the cart will be empty after creation.
 *   If a user is logged in the cart's customer id and email will be set."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           region_id:
 *             type: string
 *             description: The id of the Region to create the Cart in.
 *           country_code:
 *             type: string
 *             description: "The 2 character ISO country code to create the Cart in."
 *           items:
 *             description: "An optional array of `variant_id`, `quantity` pairs to generate Line Items from."
 *             type: array
 *             items:
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to generate a Line Item from.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Product Variant to add
 *                   type: integer
 *           context:
 *             description: "An optional object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`"
 *             type: object
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "Successfully created a new Cart"
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    region_id: Validator.string().optional(),
    country_code: Validator.string().optional(),
    items: Validator.array()
      .items({
        variant_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .optional(),
    context: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const reqContext = {
    ip: reqIp.getClientIp(req),
    user_agent: req.get("user-agent"),
  }

  try {
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")

    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      // Add a default region if no region has been specified
      let regionId = value.region_id
      if (!value.region_id) {
        const regionService = req.scope.resolve("regionService")
        const regions = await regionService.withTransaction(manager).list({})
        regionId = regions[0].id
      }

      const toCreate = {
        region_id: regionId,
        context: {
          ...reqContext,
          ...value.context,
        },
      }

      if (req.user && req.user.customer_id) {
        const customerService = req.scope.resolve("customerService")
        const customer = await customerService
          .withTransaction(manager)
          .retrieve(req.user.customer_id)
        toCreate.customer_id = customer.id
        toCreate.email = customer.email
      }

      if (value.country_code) {
        toCreate.shipping_address = {
          country_code: value.country_code.toLowerCase(),
        }
      }

      let cart = await cartService.withTransaction(manager).create(toCreate)
      if (value.items) {
        await Promise.all(
          value.items.map(async i => {
            await lineItemService.withTransaction(manager).create({
              cart_id: cart.id,
              variant_id: i.variant_id,
              quantity: i.quantity,
              region_id: value.region_id,
            })
          })
        )
      }

      cart = await cartService.withTransaction(manager).retrieve(cart.id, {
        select: defaultFields,
        relations: defaultRelations,
      })

      res.status(200).json({ cart })
    })
  } catch (err) {
    throw err
  }
}
