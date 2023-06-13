import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Product from "./product"

@Entity({ tableName: "product_tag" })
class ProductTag {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @ManyToMany(() => Product, (product) => product.tags)
  products = new Collection<Product>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptag")
  }
}

export default ProductTag
