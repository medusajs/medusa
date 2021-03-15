import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /products/{id}/variants/{variant_id}
 * operationId: "PostProductsProductVariantsVariant"
 * summary: "Update a Product Variant"
 * description: "Update a Product Variant."
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) variant_id=* {string} The id of the Product Variant.
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
  const { id, variant_id } = req.params
  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    sku: Validator.string().optional(),
    ean: Validator.string().optional(),
    barcode: Validator.string().optional(),
    prices: Validator.array().items(
      Validator.object()
        .keys({
          region_id: Validator.string(),
          currency_code: Validator.string(),
          amount: Validator.number()
            .integer()
            .required(),
          sale_amount: Validator.number().optional(),
        })
        .xor("region_id", "currency_code")
    ),
    options: Validator.array().items({
      option_id: Validator.string().required(),
      value: Validator.alternatives(
        Validator.string(),
        Validator.number()
      ).required(),
    }),
    inventory_quantity: Validator.number().optional(),
    allow_backorder: Validator.boolean().optional(),
    manage_inventory: Validator.boolean().optional(),
    weight: Validator.number().optional(),
    length: Validator.number().optional(),
    height: Validator.number().optional(),
    width: Validator.number().optional(),
    hs_code: Validator.string()
      .optional()
      .allow(null, ""),
    origin_country: Validator.string()
      .optional()
      .allow(null, ""),
    mid_code: Validator.string()
      .optional()
      .allow(null, ""),
    material: Validator.string()
      .optional()
      .allow(null, ""),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const productVariantService = req.scope.resolve("productVariantService")

    await productVariantService.update(variant_id, value)

    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })
    res.json({ product })
  } catch (err) {
    throw err
  }
}
