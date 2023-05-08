import _ from "lodash"
import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

import ProductCollection from "./product-collection"
import ProductType from "./product-type"
import ProductTag from "./product-tag"

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

@Entity()
class Product {
  @PrimaryKey()
  id!: string

  @Property()
  title: string
  @Property()
  @Unique()
  handle!: string
  @Property({ nullable: true })
  subtitle?: string
  @Property({ nullable: true })
  description?: string

  @Property()
  is_giftcard: boolean = false

  @Enum(() => ProductStatus)
  status!: ProductStatus

  // images: Image[]

  @Property({ nullable: true })
  thumbnail?: string

  // options: ProductOption[]
  // variants: ProductVariant[]
  // categories: ProductCategory[]

  @Property({ nullable: true })
  weight?: number
  @Property({ nullable: true })
  length?: number
  @Property({ nullable: true })
  height?: number
  @Property({ nullable: true })
  width?: number

  @Property({ nullable: true })
  origin_country?: string
  @Property({ nullable: true })
  hs_code?: string
  @Property({ nullable: true })
  mid_code?: string

  @Property({ nullable: true })
  material?: string

  @ManyToOne(() => ProductCollection, { nullable: true })
  collection = new Collection<ProductCollection>(this)

  @ManyToOne(() => ProductType, { nullable: true })
  type = new Collection<ProductType>(this)

  @ManyToMany(() => ProductTag, undefined, {
    pivotTable: "product_tag",
  })
  tags = new Collection<ProductTag>(this)

  @Property()
  discountable: boolean = true

  @Property({ nullable: true })
  external_id?: string

  @Property({ columnType: "datetime" })
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date(), columnType: "datetime" })
  updatedAt: Date = new Date()

  @Property({ type: "json", nullable: true })
  metadata?: {}

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "prod")
    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}

export default Product
