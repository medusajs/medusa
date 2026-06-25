import { model, ProductUtils } from "@medusajs/framework/utils"

import ProductCategory from "./product-category"
import ProductCollection from "./product-collection"
import ProductImage from "./product-image"
import ProductOption from "./product-option"
import ProductProductOption from "./product-product-option"
import ProductTag from "./product-tag"
import ProductType from "./product-type"
import ProductVariant from "./product-variant"

/**
 * A product in the catalog.
 */
const Product = model
  .define("Product", {
    id: model.id({ prefix: "prod" }).primaryKey(),
    /**
     * The product's display title.
     */
    title: model.text().searchable().translatable(),
    /**
     * The product's unique URL handle.
     */
    handle: model.text(),
    /**
     * The product's subtitle.
     */
    subtitle: model.text().searchable().translatable().nullable(),
    /**
     * The product's description.
     */
    description: model.text().searchable().translatable().nullable(),
    /**
     * Whether the product is a gift card.
     */
    is_giftcard: model.boolean().default(false),
    /**
     * The product's status.
     */
    status: model
      .enum(ProductUtils.ProductStatus)
      .default(ProductUtils.ProductStatus.DRAFT),
    /**
     * The product's thumbnail image URL.
     */
    thumbnail: model.text().nullable(),
    /**
     * The product's weight.
     */
    weight: model.float().nullable(),
    /**
     * The product's length.
     */
    length: model.float().nullable(),
    /**
     * The product's height.
     */
    height: model.float().nullable(),
    /**
     * The product's width.
     */
    width: model.float().nullable(),
    /**
     * The product's country of origin.
     */
    origin_country: model.text().nullable(),
    /**
     * The product's Harmonized System code.
     */
    hs_code: model.text().nullable(),
    /**
     * The product's MID code.
     */
    mid_code: model.text().nullable(),
    /**
     * The product's material.
     */
    material: model.text().translatable().nullable(),
    /**
     * Whether the product is eligible for discounts.
     */
    discountable: model.boolean().default(true),
    /**
     * The product's external identifier.
     */
    external_id: model.text().nullable(),
    /**
     * The product's metadata.
     */
    metadata: model.json().nullable(),
    /**
     * The product's variants.
     */
    variants: model
      .hasMany(() => ProductVariant, {
        mappedBy: "product",
      })
      .searchable(),
    /**
     * The associated product type.
     */
    type: model
      .belongsTo(() => ProductType, {
        mappedBy: "products",
      })
      .nullable(),
    /**
     * The associated product tags.
     */
    tags: model.manyToMany(() => ProductTag, {
      mappedBy: "products",
      pivotTable: "product_tags",
    }),
    options: model.manyToMany(() => ProductOption, {
      pivotEntity: () => ProductProductOption,
    }),
    /**
     * @since 2.16.0
     */
    product_options: model.hasMany(() => ProductProductOption, {
      mappedBy: "product",
    }),
    /**
     * The product's images.
     */
    images: model.hasMany(() => ProductImage, {
      mappedBy: "product",
    }),
    /**
     * The associated product collection.
     */
    collection: model
      .belongsTo(() => ProductCollection, {
        mappedBy: "products",
      })
      .nullable(),
    /**
     * The associated product categories.
     */
    categories: model.manyToMany(() => ProductCategory, {
      pivotTable: "product_category_product",
      mappedBy: "products",
    }),
  })
  .cascades({
    delete: ["variants", "images"],
    detach: ["options"],
  })
  .indexes([
    {
      name: "IDX_product_handle_unique",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_type_id",
      on: ["type_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_collection_id",
      on: ["collection_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_status",
      on: ["status"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default Product
