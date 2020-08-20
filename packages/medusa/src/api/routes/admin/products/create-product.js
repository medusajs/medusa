import { MedusaError, Validator } from "medusa-core-utils"

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
    const { variants } = value
    delete value.variants

    const productService = req.scope.resolve("productService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    if (!value.thumbnail && value.images && value.images.length) {
      value.thumbnail = value.images[0]
    }
    let newProduct = await productService.createDraft(value)

    if (variants) {
      const optionIds = value.options.map(
        o => newProduct.options.find(newO => newO.title === o.title)._id
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
          return productService.createVariant(newProduct._id, variant)
        })
      )
    }

    // Add to default shipping profile
    if (value.is_giftcard) {
      const { _id } = await shippingProfileService.retrieveGiftCardDefault()
      await shippingProfileService.addProduct(_id, newProduct._id)
    } else {
      const { _id } = await shippingProfileService.retrieveDefault()
      await shippingProfileService.addProduct(_id, newProduct._id)
    }

    newProduct = await productService.decorate(
      newProduct,
      [
        "title",
        "description",
        "tags",
        "handle",
        "images",
        "thumbnail",
        "options",
        "published",
      ],
      ["variants"]
    )
    res.json({ product: newProduct })
  } catch (err) {
    console.log(err)
    throw err
  }
}
