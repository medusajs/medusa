import {
  BeforeCreate,
  Entity,
  Index,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId, kebabCase } from "@medusajs/utils"

@Entity({ tableName: "product_collection" })
class ProductCollection {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Index({
    name: "IDX_product_collection_handle_unique",
    properties: ["handle"],
    expression:
      "CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_collection_handle_unique ON product_collection (handle) WHERE deleted_at IS NULL",
  })
  handle: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  /**
   * Soft deleted will be an update of the record which set the deleted_at to new Date()
   */
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
