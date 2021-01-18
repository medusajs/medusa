import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "."

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
      sku: Validator.string().allow(null),
      ean: Validator.string().allow(null),
      upc: Validator.string().allow(null),
      barcode: Validator.string().allow(null),
      hs_code: Validator.string().allow(null),
      inventory_quantity: Validator.number().default(0),
      allow_backorder: Validator.boolean().optional(),
      manage_inventory: Validator.boolean().optional(),
      weight: Validator.number().optional(),
      length: Validator.number().optional(),
      height: Validator.number().optional(),
      width: Validator.number().optional(),
      origin_country: Validator.string().allow(null),
      mid_code: Validator.string().allow(null),
      material: Validator.string().allow(null),
      metadata: Validator.object().optional(),
      prices: Validator.array()
        .items(
          Validator.object()
            .keys({
              region_id: Validator.string(),
              currency_code: Validator.string().required(),
              amount: Validator.number().required(),
              sale_amount: Validator.number().optional(),
            })
            .xor("region_id", "currency_code")
        )
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
    })

    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ product })
  } catch (err) {
    throw err
  }
}
