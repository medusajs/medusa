import { BeforeCreate, Entity, PrimaryKey, Property } from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "product_type" })
class ProductType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "json", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

export default ProductType
