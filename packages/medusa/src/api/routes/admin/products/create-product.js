import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    subtitle: Validator.string().allow(""),
    description: Validator.string().allow(""),
    tags: Validator.string().optional(),
    is_giftcard: Validator.boolean().default(false),
    images: Validator.array()
      .items(Validator.string())
      .optional(),
    thumbnail: Validator.string().optional(),
    handle: Validator.string().optional(),
    options: Validator.array().items({
      title: Validator.string().required(),
    }),
    variants: Validator.array().items({
      title: Validator.string().required(),
      sku: Validator.string().allow(""),
      ean: Validator.string().allow(""),
      upc: Validator.string().allow(""),
      barcode: Validator.string().allow(""),
      hs_code: Validator.string().allow(""),
      inventory_quantity: Validator.number().default(0),
      allow_backorder: Validator.boolean().optional(),
      manage_inventory: Validator.boolean().optional(),
      weight: Validator.number().optional(),
      length: Validator.number().optional(),
      height: Validator.number().optional(),
      width: Validator.number().optional(),
      origin_country: Validator.string().allow(""),
      mid_code: Validator.string().allow(""),
      material: Validator.string().allow(""),
      metadata: Validator.object().optional(),
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
    }),
    weight: Validator.number().optional(),
    length: Validator.number().optional(),
    height: Validator.number().optional(),
    width: Validator.number().optional(),
    hs_code: Validator.string().allow(""),
    origin_country: Validator.string().allow(""),
    mid_code: Validator.string().allow(""),
    material: Validator.string().allow(""),
    metadata: Validator.object().optional(),
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
      // Get default shipping profile
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
          variants.map(async v => {
            const variant = {
              ...v,
              options: v.options.map((o, index) => ({
                ...o,
                option_id: optionIds[index],
              })),
            }
            await productVariantService
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
