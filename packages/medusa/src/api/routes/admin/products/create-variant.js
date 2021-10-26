import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /products/{id}/variants
 * operationId: "PostProductsProductVariants"
 * summary: "Create a Product Variant"
 * description: "Creates a Product Variant. Each Product Variant must have a unique combination of Product Option Values."
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             description: The title to identify the Product Variant by.
 *             type: string
 *           sku:
 *             description: The unique SKU for the Product Variant.
 *             type: string
 *           ean:
 *             description: The EAN number of the item.
 *             type: string
 *           upc:
 *             description: The UPC number of the item.
 *             type: string
 *           barcode:
 *             description: A generic GTIN field for the Product Variant.
 *             type: string
 *           hs_code:
 *             description: The Harmonized System code for the Product Variant.
 *             type: string
 *           inventory_quantity:
 *             description: The amount of stock kept for the Product Variant.
 *             type: integer
 *           allow_backorder:
 *             description: Whether the Product Variant can be purchased when out of stock.
 *             type: boolean
 *           manage_inventory:
 *             description: Whether Medusa should keep track of the inventory for this Product Variant.
 *             type: boolean
 *           weight:
 *             description: The wieght of the Product Variant.
 *             type: string
 *           length:
 *             description: The length of the Product Variant.
 *             type: string
 *           height:
 *             description: The height of the Product Variant.
 *             type: string
 *           width:
 *             description: The width of the Product Variant.
 *             type: string
 *           origin_country:
 *             description: The country of origin of the Product Variant.
 *             type: string
 *           mid_code:
 *             description: The Manufacturer Identification code for the Product Variant.
 *             type: string
 *           material:
 *             description: The material composition of the Product Variant.
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 *           prices:
 *             type: array
 *             items:
 *               properties:
 *                 region_id:
 *                   description: The id of the Region for which the price is used.
 *                   type: string
 *                 currency_code:
 *                   description: The 3 character ISO currency code for which the price will be used.
 *                   type: string
 *                 amount:
 *                   description: The amount to charge for the Product Variant.
 *                   type: integer
 *                 sale_amount:
 *                   description: The sale amount to charge for the Product Variant.
 *                   type: integer
 *           options:
 *             type: array
 *             items:
 *               properties:
 *                 option_id:
 *                   description: The id of the Product Option to set the value for.
 *                   type: string
 *                 value:
 *                   description: The value to give for the Product Option.
 *                   type: string
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().required(),
    sku: Validator.string().allow(""),
    ean: Validator.string().allow(""),
    upc: Validator.string().allow(""),
    barcode: Validator.string().allow(""),
    hs_code: Validator.string().allow(""),
    inventory_quantity: Validator.number().default(0),
    allow_backorder: Validator.boolean().optional(),
    manage_inventory: Validator.boolean().optional(),
    weight: Validator.number().allow(null).optional(),
    length: Validator.number().allow(null).optional(),
    height: Validator.number().allow(null).optional(),
    width: Validator.number().allow(null).optional(),
    origin_country: Validator.string().allow(""),
    mid_code: Validator.string().allow(""),
    material: Validator.string().allow(""),
    metadata: Validator.object().optional(),
    prices: Validator.array()
      .items(
        Validator.object()
          .keys({
            region_id: Validator.string().empty(null),
            currency_code: Validator.string().required(),
            amount: Validator.number().integer().required(),
            sale_amount: Validator.number().optional(),
          })
          .xor("region_id", "currency_code")
      )
      .required(),
    options: Validator.array()
      .items({
        option_id: Validator.string().required(),
        value: Validator.string().required(),
      })
      .default([]),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productVariantService = req.scope.resolve("productVariantService")
  const productService = req.scope.resolve("productService")

  await productVariantService.create(id, value)

  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ product })
}
