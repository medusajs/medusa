import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /products/import
 * operationId: "PostProductsImport"
 * summary: "Import products"
 * description: "Imports products"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           products:
 *             description: The products to import
 *             type: array
 *             items:
 *               properties:
 *                 title:
 *                   description: "The title of the Product"
 *                   type: string
 *                 subtitle:
 *                   description: "The subtitle of the Product"
 *                   type: string
 *                 description:
 *                   description: "A description of the Product."
 *                   type: string
 *                 images:
 *                   description: Images of the Product.
 *                   type: array
 *                   items:
 *                     type: string
 *                 thumbnail:
 *                   description: The thumbnail to use for the Product.
 *                   type: string
 *                 handle:
 *                   description: A unique handle to identify the Product by.
 *                   type: string
 *                 type:
 *                   description: The Product Type to associate the Product with.
 *                   type: string
 *                 collection:
 *                   description: The Collection the Product should belong to.
 *                   type: string
 *                 tags:
 *                   description: Tags to associate the Product with.
 *                   type: array
 *                   items:
 *                     properties:
 *                       type: string
 *                 options:
 *                   description: The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
 *                   type: array
 *                   items:
 *                     properties:
 *                       title:
 *                         description: The title to identify the Product Option by.
 *                         type: string
 *                 variants:
 *                   description: A list of Product Variants to create with the Product.
 *                   type: array
 *                   items:
 *                     properties:
 *                       title:
 *                         description: The title to identify the Product Variant by.
 *                         type: string
 *                       sku:
 *                         description: The unique SKU for the Product Variant.
 *                         type: string
 *                       ean:
 *                         description: The EAN number of the item.
 *                         type: string
 *                       upc:
 *                         description: The UPC number of the item.
 *                         type: string
 *                       barcode:
 *                         description: A generic GTIN field for the Product Variant.
 *                         type: string
 *                       hs_code:
 *                         description: The Harmonized System code for the Product Variant.
 *                         type: string
 *                       inventory_quantity:
 *                         description: The amount of stock kept for the Product Variant.
 *                         type: integer
 *                       allow_backorder:
 *                         description: Whether the Product Variant can be purchased when out of stock.
 *                         type: boolean
 *                       manage_inventory:
 *                         description: Whether Medusa should keep track of the inventory for this Product Variant.
 *                         type: boolean
 *                       weight:
 *                         description: The wieght of the Product Variant.
 *                         type: string
 *                       length:
 *                         description: The length of the Product Variant.
 *                         type: string
 *                       height:
 *                         description: The height of the Product Variant.
 *                         type: string
 *                       width:
 *                         description: The width of the Product Variant.
 *                         type: string
 *                       origin_country:
 *                         description: The country of origin of the Product Variant.
 *                         type: string
 *                       mid_code:
 *                         description: The Manufacturer Identification code for the Product Variant.
 *                         type: string
 *                       material:
 *                         description: The material composition of the Product Variant.
 *                         type: string
 *                       prices:
 *                         type: array
 *                         items:
 *                           properties:
 *                             currency_code:
 *                               description: The 3 character ISO currency code for which the price will be used.
 *                               type: string
 *                             amount:
 *                               description: The amount to charge for the Product Variant.
 *                               type: integer
 *                       options:
 *                         type: array
 *                         items:
 *                           properties:
 *                             value:
 *                               description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                               type: string
 *                 weight:
 *                   description: The wieght of the Product.
 *                   type: string
 *                 length:
 *                   description: The length of the Product.
 *                   type: string
 *                 height:
 *                   description: The height of the Product.
 *                   type: string
 *                 width:
 *                   description: The width of the Product.
 *                   type: string
 *                 origin_country:
 *                   description: The country of origin of the Product.
 *                   type: string
 *                 mid_code:
 *                   description: The Manufacturer Identification code for the Product.
 *                   type: string
 *                 material:
 *                   description: The material composition of the Product.
 *                   type: string
 * tags:
 *   - Import
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             products:
 *               type: string
 */

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
          .allow(""),
        prices: Validator.array()
          .items(
            Validator.object().keys({
              currency_code: Validator.string(),
              amount: Validator.number()
                .integer()
                .required(),
            })
          )
          .optional(),
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
