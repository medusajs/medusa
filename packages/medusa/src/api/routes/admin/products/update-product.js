import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "."

/**
 * @oas [post] /products/{id}
 * operationId: "PostProductsProduct"
 * summary: "Update a Product"
 * description: "Updates a Product"
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             description: "The title of the Product"
 *             type: string
 *           subtitle:
 *             description: "The subtitle of the Product"
 *             type: string
 *           description:
 *             description: "A description of the Product."
 *             type: string
 *           is_giftcard:
 *             description: A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
 *             type: boolean
 *           discountable:
 *             description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *             type: boolean
 *           images:
 *             description: Images of the Product.
 *             type: array
 *             items:
 *               type: string
 *           thumbnail:
 *             description: The thumbnail to use for the Product.
 *             type: string
 *           handle:
 *             description: A unique handle to identify the Product by.
 *             type: string
 *           type:
 *             description: The Product Type to associate the Product with.
 *             type: object
 *             properties:
 *               value:
 *                 description: The value of the Product Type.
 *                 type: string
 *           collection_id:
 *             description: The id of the Collection the Product should belong to.
 *             type: string
 *           tags:
 *             description: Tags to associate the Product with.
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: The id of an existing Tag.
 *                   type: string
 *                 value:
 *                   description: The value of the Tag, these will be upserted.
 *                   type: string
 *           options:
 *             description: The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
 *             type: array
 *             items:
 *               properties:
 *                 title:
 *                   description: The title to identify the Product Option by.
 *                   type: string
 *           variants:
 *             description: A list of Product Variants to create with the Product.
 *             type: array
 *             items:
 *               properties:
 *                 title:
 *                   description: The title to identify the Product Variant by.
 *                   type: string
 *                 sku:
 *                   description: The unique SKU for the Product Variant.
 *                   type: string
 *                 ean:
 *                   description: The EAN number of the item.
 *                   type: string
 *                 upc:
 *                   description: The UPC number of the item.
 *                   type: string
 *                 barcode:
 *                   description: A generic GTIN field for the Product Variant.
 *                   type: string
 *                 hs_code:
 *                   description: The Harmonized System code for the Product Variant.
 *                   type: string
 *                 inventory_quantity:
 *                   description: The amount of stock kept for the Product Variant.
 *                   type: integer
 *                 allow_backorder:
 *                   description: Whether the Product Variant can be purchased when out of stock.
 *                   type: boolean
 *                 manage_inventory:
 *                   description: Whether Medusa should keep track of the inventory for this Product Variant.
 *                   type: boolean
 *                 weight:
 *                   description: The wieght of the Product Variant.
 *                   type: string
 *                 length:
 *                   description: The length of the Product Variant.
 *                   type: string
 *                 height:
 *                   description: The height of the Product Variant.
 *                   type: string
 *                 width:
 *                   description: The width of the Product Variant.
 *                   type: string
 *                 origin_country:
 *                   description: The country of origin of the Product Variant.
 *                   type: string
 *                 mid_code:
 *                   description: The Manufacturer Identification code for the Product Variant.
 *                   type: string
 *                 material:
 *                   description: The material composition of the Product Variant.
 *                   type: string
 *                 metadata:
 *                   description: An optional set of key-value pairs with additional information.
 *                   type: object
 *                 prices:
 *                   type: array
 *                   items:
 *                     properties:
 *                       region_id:
 *                         description: The id of the Region for which the price is used.
 *                         type: string
 *                       currency_code:
 *                         description: The 3 character ISO currency code for which the price will be used.
 *                         type: string
 *                       amount:
 *                         description: The amount to charge for the Product Variant.
 *                         type: integer
 *                       sale_amount:
 *                         description: The sale amount to charge for the Product Variant.
 *                         type: integer
 *                 options:
 *                   type: array
 *                   items:
 *                     properties:
 *                       value:
 *                         description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                         type: string
 *           weight:
 *             description: The wieght of the Product.
 *             type: string
 *           length:
 *             description: The length of the Product.
 *             type: string
 *           height:
 *             description: The height of the Product.
 *             type: string
 *           width:
 *             description: The width of the Product.
 *             type: string
 *           origin_country:
 *             description: The country of origin of the Product.
 *             type: string
 *           mid_code:
 *             description: The Manufacturer Identification code for the Product.
 *             type: string
 *           material:
 *             description: The material composition of the Product.
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
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
    title: Validator.string().optional(),
    subtitle: Validator.string()
      .optional()
      .allow(null, ""),
    description: Validator.string().optional(),
    discountable: Validator.boolean().optional(),
    status: Validator.string().valid(
      "proposed",
      "draft",
      "published",
      "rejected"
    ),
    type: Validator.object()
      .keys({
        id: Validator.string().optional(),
        value: Validator.string().required(),
      })
      .allow(null)
      .optional(),
    collection_id: Validator.string()
      .allow(null)
      .optional(),
    tags: Validator.array()
      .items({
        id: Validator.string().optional(),
        value: Validator.string().required(),
      })
      .optional(),
    handle: Validator.string().optional(),
    weight: Validator.number()
      .allow(null)
      .optional(),
    length: Validator.number()
      .allow(null)
      .optional(),
    height: Validator.number()
      .allow(null)
      .optional(),
    width: Validator.number()
      .allow(null)
      .optional(),
    origin_country: Validator.string().allow(null, ""),
    hs_code: Validator.string().allow(null, ""),
    mid_code: Validator.string().allow(null, ""),
    material: Validator.string().allow(null, ""),
    images: Validator.array()
      .items(Validator.string())
      .optional()
      .optional(),
    thumbnail: Validator.string().optional(),
    variants: Validator.array()
      .items({
        id: Validator.string().optional(),
        title: Validator.string().allow(null),
        sku: Validator.string().allow(null),
        ean: Validator.string().allow(null),
        barcode: Validator.string().allow(null),
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
        inventory_quantity: Validator.number().allow(null),
        allow_backorder: Validator.boolean().allow(null),
        manage_inventory: Validator.boolean().allow(null),
        weight: Validator.number()
          .allow(null)
          .optional(),
        length: Validator.number()
          .allow(null)
          .optional(),
        height: Validator.number()
          .allow(null)
          .optional(),
        width: Validator.number()
          .allow(null)
          .optional(),
        hs_code: Validator.string()
          .optional()
          .allow(null, ""),
        origin_country: Validator.string().allow(null, ""),
        mid_code: Validator.string().allow(null, ""),
        material: Validator.string().allow(null, ""),
        metadata: Validator.object().optional(),
        upc: Validator.string().allow(null),
      })
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      await productService.withTransaction(manager).update(id, value)
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
