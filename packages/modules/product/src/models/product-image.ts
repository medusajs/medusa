import { model } from "@zjedene-medusa/framework/utils"
import Product from "./product"
import ProductVariant from "./product-variant"
import ProductVariantProductImage from "./product-variant-product-image"

const ProductImage = model
  .define(
    { tableName: "image", name: "ProductImage" },
    {
      id: model.id({ prefix: "img" }).primaryKey(),
      url: model.text(),
      metadata: model.json().nullable(),
      rank: model.number().default(0),
      product: model.belongsTo(() => Product, {
        mappedBy: "images",
      }),
      /**
       * @since 2.11.2
       */
      variants: model.manyToMany(() => ProductVariant, {
        mappedBy: "images",
        pivotEntity: () => ProductVariantProductImage,
      }),
    }
  )
  .indexes([
    {
      name: "IDX_product_image_url",
      on: ["url"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_image_rank",
      on: ["rank"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_image_url_rank_product_id",
      on: ["url", "rank", "product_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_image_rank_product_id",
      on: ["rank", "product_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductImage
