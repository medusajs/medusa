import {
  BeforeCreate,
  Entity,
  Index,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import SoftDeletable from "../utils/soft-delete"

type OptionalFields = "deleted_at"

@Entity({ tableName: "product_type" })
@SoftDeletable()
class ProductType {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "json", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_type_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

export default ProductType
