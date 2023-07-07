import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId, kebabCase } from "@medusajs/utils"
import Product from "./product"
import { SoftDeletable } from "../utils"

type OptionalRelations = "products"

@Entity({ tableName: "product_collection" })
@SoftDeletable()
class ProductCollection {
  [OptionalProps]?: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Unique({
    name: "IDX_product_collection_handle_unique",
    properties: ["handle"],
  })
  handle?: string

  @OneToMany(() => Product, (product) => product.collection)
  products = new Collection<Product>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_collection_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pcol")

    if (!this.handle) {
      this.handle = kebabCase(this.title)
    }
  }
}

export default ProductCollection
