import { model } from "@medusajs/framework/utils"
import { Product, ProductImage, ProductOptionValue } from "@models"
import ProductVariantProductImage from "./product-variant-product-image"

/**
 * The product variant model represents a variant of a product. Each product can have multiple variants.
 */
const ProductVariant = model
  .define("ProductVariant", {
    /**
     * The variant's ID.
     */
    id: model.id({ prefix: "variant" }).primaryKey(),
    /**
     * The variant's title.
     */
    title: model.text().searchable().translatable(),
    /**
     * The variant's SKU (Stock Keeping Unit).
     */
    sku: model.text().searchable().nullable(),
    /**
     * The variant's barcode.
     */
    barcode: model.text().searchable().nullable(),
    /**
     * The variant's EAN (European Article Number).
     */
    ean: model.text().searchable().nullable(),
    /**
     * The variant's UPC (Universal Product Code).
     */
    upc: model.text().searchable().nullable(),
    /**
     * Whether the variant allows backorders when it's out of stock.
     */
    allow_backorder: model.boolean().default(false),
    /**
     * Whether inventory should be managed for this variant.
     */
    manage_inventory: model.boolean().default(true),
    /**
     * The variant's HS (Harmonized System) code for customs and tariff purposes.
     */
    hs_code: model.text().nullable(),
    /**
     * The variant's country of origin.
     */
    origin_country: model.text().nullable(),
    /**
     * The variant's MID code.
     */
    mid_code: model.text().nullable(),
    /**
     * The variant's material description.
     */
    material: model.text().translatable().nullable(),
    /**
     * The variant's weight.
     */
    weight: model.float().nullable(),
    /**
     * The variant's length.
     */
    length: model.float().nullable(),
    /**
     * The variant's height.
     */
    height: model.float().nullable(),
    /**
     * The variant's width.
     */
    width: model.float().nullable(),
    /**
     * The variant's metadata.
     */
    metadata: model.json().nullable(),
    /**
     * The variant's ranking order within its product.
     */
    variant_rank: model.number().default(0).nullable(),
    /**
     * @since 2.11.2
     */
    thumbnail: model.text().nullable(),
    /**
     * The product this variant belongs to.
     */
    product: model
      .belongsTo(() => Product, {
        mappedBy: "variants",
      })
      .searchable()
      .nullable(),
    /**
     * @since 2.11.2
     */
    images: model.manyToMany(() => ProductImage, {
      mappedBy: "variants",
      pivotEntity: () => ProductVariantProductImage,
    }),
    /**
     * The option values associated with this variant.
     */
    options: model.manyToMany(() => ProductOptionValue, {
      pivotTable: "product_variant_option",
      mappedBy: "variants",
      joinColumn: "variant_id",
      inverseJoinColumn: "option_value_id",
    }),
  })
  .indexes([
    {
      name: "IDX_product_variant_id_product_id",
      on: ["id", "product_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_variant_product_id",
      on: ["product_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_variant_sku_unique",
      on: ["sku"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_variant_barcode_unique",
      on: ["barcode"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_variant_ean_unique",
      on: ["ean"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_variant_upc_unique",
      on: ["upc"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductVariant
