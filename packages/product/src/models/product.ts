import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { ProductTypes } from "@medusajs/types"
import { generateEntityId, kebabCase } from "@medusajs/utils"
import ProductCategory from "./product-category"
import ProductCollection from "./product-collection"
import ProductOption from "./product-option"
import ProductTag from "./product-tag"
import ProductType from "./product-type"
import ProductVariant from "./product-variant"

type OptionalRelations = "collection" | "type"
type OptionalFields =
  | "is_giftcard"
  | "discountable"
  | "created_at"
  | "updated_at"
  | "deleted_at"

@Entity({ tableName: "product" })
class Product {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Unique({
    name: "IDX_product_handle_unique",
    properties: ["handle"],
  })
  handle?: string | null

  @Property({ columnType: "text", nullable: true })
  subtitle?: string | null

  @Property({ columnType: "text", nullable: true })
  description?: string | null

  @Property({ columnType: "boolean", default: false })
  is_giftcard!: boolean

  @Enum(() => ProductTypes.ProductStatus)
  status!: ProductTypes.ProductStatus

  // TODO: add images model
  // images: Image[]

  @Property({ columnType: "text", nullable: true })
  thumbnail?: string | null

  @OneToMany(() => ProductOption, (o) => o.product)
  options = new Collection<ProductOption>(this)

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants = new Collection<ProductVariant>(this)

  @Property({ columnType: "text", nullable: true })
  weight?: number | null

  @Property({ columnType: "text", nullable: true })
  length?: number | null

  @Property({ columnType: "text", nullable: true })
  height?: number | null

  @Property({ columnType: "text", nullable: true })
  width?: number | null

  @Property({ columnType: "text", nullable: true })
  origin_country?: string | null

  @Property({ columnType: "text", nullable: true })
  hs_code?: string | null

  @Property({ columnType: "text", nullable: true })
  mid_code?: string | null

  @Property({ columnType: "text", nullable: true })
  material?: string | null

  @ManyToOne(() => ProductCollection, { nullable: true })
  collection!: ProductCollection

  @ManyToOne(() => ProductType, {
    nullable: true,
    index: "IDX_product_type_id",
  })
  type!: ProductType

  @ManyToMany(() => ProductTag, "products", {
    owner: true,
    pivotTable: "product_tags",
    index: "IDX_product_tag_id",
  })
  tags = new Collection<ProductTag>(this)

  @ManyToMany(() => ProductCategory, "products", {
    owner: true,
    pivotTable: "product_category_product",
  })
  categories = new Collection<ProductCategory>(this)

  @Property({ columnType: "boolean", default: true })
  discountable: boolean

  @Property({ columnType: "text", nullable: true })
  external_id?: string | null

  @Property({ onCreate: () => new Date(), columnType: "timestamptz" })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
  })
  updated_at: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "prod")
    if (!this.handle) {
      this.handle = kebabCase(this.title)
    }
  }
}

export default Product
