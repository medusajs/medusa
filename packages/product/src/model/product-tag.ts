import { BeforeCreate, Entity, PrimaryKey, Property } from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity()
class ProductTag {
  @PrimaryKey()
  id!: string

  @Property()
  value: string

  @Property({ type: "json", nullable: true })
  metadata?: {}

  @Property({ columnType: "datetime" })
  deletedAt: Date = new Date()

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptag")
  }
}

export default ProductTag
