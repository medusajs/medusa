import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

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
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
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
