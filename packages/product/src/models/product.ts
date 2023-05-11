import _ from "lodash"
import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import ProductTag from "./product-tag"
import ProductCollection from './product-collection'
import ProductType from './product-type'

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

@Entity({ tableName: "product" })
class Product {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Index({
    name: "IDX_product_handle_unique",
    properties: ["handle"],
    expression:
      "CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_handle_unique ON product (handle) WHERE deleted_at IS NULL",
  })
  handle?: string | null

  @Property({ columnType: "text", nullable: true })
  subtitle?: string | null

  @Property({ columnType: "text", nullable: true })
  description?: string | null

  @Property({ columnType: "boolean", default: false })
  is_giftcard!: boolean

  @Enum(() => ProductStatus)
  status!: ProductStatus

  // images: Image[]

  @Property({ columnType: "text", nullable: true })
  thumbnail?: string | null

  // options: ProductOption[]
  // variants: ProductVariant[]
  // categories: ProductCategory[]

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

  @ManyToOne(() => ProductType, { nullable: true })
  type!: ProductType

  @ManyToMany(() => ProductTag, 'products', {
    owner: true,
    pivotTable: "product_tags",
  })
  tags?: Collection<ProductTag>

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

  /**
   * Soft deleted will be an update of the record which set the deleted_at to new Date()
   */
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "prod")
    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}

export default Product
