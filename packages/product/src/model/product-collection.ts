import _ from "lodash"
import {
  BeforeCreate,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity()
class ProductCollection {
  @PrimaryKey()
  id!: string

  @Property()
  title: string

  @Property()
  @Unique()
  handle: string

  @Property({ type: "json", nullable: true })
  metadata?: {}

  @Property({ columnType: "datetime" })
  deletedAt: Date = new Date()

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pcol")

    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}

export default ProductCollection
