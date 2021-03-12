import { MedusaError, Validator } from "medusa-core-utils"
export default async (req, res) => {
  const schema = Validator.object().keys({
    products: Validator.array().items({
      title: Validator.string().required(),
      subtitle: Validator.string().allow(""),
      description: Validator.string().allow(""),
      images: Validator.array()
        .items(Validator.string())
        .optional(),
      thumbnail: Validator.string().optional(),
      handle: Validator.string().optional(),
      type: Validator.string().optional(),
      collection: Validator.string().optional(),
      tags: Validator.array()
        .items()
        .optional(),
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
        origin_country: Validator.string()
          .optional()
          .allow(""),
        mid_code: Validator.string()
          .optional()
          .allow(""),
        material: Validator.string()
          .optional()
          .allow("")
          .allow(null),
        metadata: Validator.object().optional(),
        prices: Validator.array()
          .items(
            Validator.object()
              .keys({
                currency_code: Validator.string(),
                amount: Validator.number()
                  .integer()
                  .required(),
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
      hs_code: Validator.string()
        .optional()
        .allow(""),
      origin_country: Validator.string()
        .optional()
        .allow(""),
      mid_code: Validator.string()
        .optional()
        .allow(""),
      material: Validator.string()
        .optional()
        .allow(""),
      metadata: Validator.object().optional(),
    }),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const importService = req.scope.resolve("importService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const shippingProfile = await shippingProfileService.retrieveDefault()
    const productIds = await importService.importProducts(
      value.products,
      shippingProfile.id
    )

    res.json({ products: productIds })
  } catch (err) {
    throw err
  }
}
