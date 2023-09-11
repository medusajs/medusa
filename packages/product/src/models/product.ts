import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Filter,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import {
  DALUtils,
  generateEntityId,
  kebabCase,
  ProductUtils,
} from "@medusajs/utils"
import ProductCategory from "./product-category"
import ProductCollection from "./product-collection"
import ProductOption from "./product-option"
import ProductTag from "./product-tag"
import ProductType from "./product-type"
import ProductVariant from "./product-variant"
import ProductImage from "./product-image"
import { DAL } from "@medusajs/types"

type OptionalRelations = "collection" | "type"
type OptionalFields =
  | "collection_id"
  | "type_id"
  | "is_giftcard"
  | "discountable"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "product" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
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

  @Enum(() => ProductUtils.ProductStatus)
  status!: ProductUtils.ProductStatus

  @Property({ columnType: "text", nullable: true })
  thumbnail?: string | null

  @OneToMany(() => ProductOption, (o) => o.product, {
    cascade: ["soft-remove"] as any,
  })
  options = new Collection<ProductOption>(this)

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: ["soft-remove"] as any,
  })
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

  @Property({ columnType: "text", nullable: true })
  collection_id!: string

  @ManyToOne(() => ProductCollection, {
    nullable: true,
    fieldName: "collection_id",
  })
  collection!: ProductCollection | null

  @Property({ columnType: "text", nullable: true })
  type_id!: string

  @ManyToOne(() => ProductType, {
    nullable: true,
    index: "IDX_product_type_id",
    fieldName: "type_id",
  })
  type!: ProductType

  @ManyToMany(() => ProductTag, "products", {
    owner: true,
    pivotTable: "product_tags",
    index: "IDX_product_tag_id",
    cascade: ["soft-remove"] as any,
  })
  tags = new Collection<ProductTag>(this)

  @ManyToMany(() => ProductImage, "products", {
    owner: true,
    pivotTable: "product_images",
    index: "IDX_product_image_id",
    cascade: ["soft-remove"] as any,
    joinColumn: "product_id",
    inverseJoinColumn: "image_id",
  })
  images = new Collection<ProductImage>(this)

  @ManyToMany(() => ProductCategory, "products", {
    owner: true,
    pivotTable: "product_category_product",
    cascade: ["soft-remove"] as any,
  })
  categories = new Collection<ProductCategory>(this)

  @Property({ columnType: "boolean", default: true })
  discountable: boolean

  @Property({ columnType: "text", nullable: true })
  external_id?: string | null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_product_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

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
