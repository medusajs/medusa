import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Product from "./product"
import SoftDeletable from "../utils/soft-delete"

type OptionalRelations = "products"
type OptionalFields = "deleted_at"

@Entity({ tableName: "image" })
@SoftDeletable()
class ProductImage {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  url: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_image_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @ManyToMany(() => Product, (product) => product.images)
  products = new Collection<Product>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "img")
  }
}

export default ProductImage
