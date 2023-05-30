import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"

import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

@Entity({ tableName: "product_option" })
@Index({
  name: "IDX_product_option_product_id",
  expression:
    'CREATE INDEX "IDX_product_option_product_id" ON "product_option" ("product_id") WHERE deleted_at IS NULL;',
})
class ProductOption {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @ManyToOne(() => Product)
  product: Product

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: [Cascade.REMOVE],
  })
  values = new Collection<ProductOptionValue>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  /**
   * Soft deleted will be an update of the record which set the deleted_at to new Date()
   */
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "opt")
  }
}

export default ProductOption
