import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "product_type" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "json", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_type_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ptyp")
  }
}

export default ProductType
