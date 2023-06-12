import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"

import ProductOption from "./product-option"
import { ProductVariant } from "./index"

@Entity({ tableName: "product_option_value" })
class ProductOptionValue {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @ManyToOne(() => ProductOption, {
    index: "IDX_product_option_value_product_option",
  })
  option: ProductOption

  @ManyToOne(() => ProductVariant, { onDelete: "cascade" })
  variant: ProductVariant

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "optval")
  }
}

export default ProductOptionValue
