import {
  BeforeCreate,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId, kebabCase } from "@medusajs/utils"

@Entity({ tableName: "product_collection" })
class ProductCollection {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Unique({
    name: "IDX_product_collection_handle_unique",
    properties: ["handle"],
  })
  handle: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pcol")

    if (!this.handle) {
      this.handle = kebabCase(this.title)
    }
  }
}

export default ProductCollection
