import { MedusaError, Validator } from "medusa-core-utils"
import { getConnection, getEntityManager } from "typeorm"

export default async (req, res) => {
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    description: Validator.string().allow(""),
    tags: Validator.string(),
    is_giftcard: Validator.boolean().default(false),
    options: Validator.array().items({
      title: Validator.string().required(),
    }),
    images: Validator.array().items(Validator.string()),
    thumbnail: Validator.string().optional(),
    variants: Validator.array().items({
      title: Validator.string().required(),
      sku: Validator.string(),
      ean: Validator.string(),
      barcode: Validator.string(),
      prices: Validator.array()
        .items({
          currency_code: Validator.string().required(),
          amount: Validator.number().required(),
        })
        .required(),
      options: Validator.array()
        .items({
          value: Validator.string().required(),
        })
        .default([]),
      inventory_quantity: Validator.number().optional(),
      allow_backorder: Validator.boolean().optional(),
      manage_inventory: Validator.boolean().optional(),
      metadata: Validator.object().optional(),
    }),
    metadata: Validator.object(),
    handle: Validator.string(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const productVariantService = req.scope.resolve("productVariantService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const { variants } = value
      delete value.variants

      if (!value.thumbnail && value.images && value.images.length) {
        value.thumbnail = value.images[0]
      }

      let shippingProfile
      // Add to default shipping profile
      if (value.is_giftcard) {
        shippingProfile = await shippingProfileService.retrieveGiftCardDefault()
      } else {
        shippingProfile = await shippingProfileService.retrieveDefault()
      }

      let newProduct = await productService
        .withTransaction(manager)
        .create({ ...value, profile_id: shippingProfile.id })

      if (variants) {
        const optionIds = value.options.map(
          o => newProduct.options.find(newO => newO.title === o.title).id
        )

        await Promise.all(
          variants.map(v => {
            const variant = {
              ...v,
              options: v.options.map((o, index) => ({
                ...o,
                option_id: optionIds[index],
              })),
            }
            return productVariantService
              .withTransaction(manager)
              .create(newProduct.id, variant)
          })
        )
      }

      // Add to default shipping profile
      await shippingProfileService
        .withTransaction(manager)
        .addProduct(shippingProfile.id, newProduct.id)

      res.json({ product: newProduct })
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}
