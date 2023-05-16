import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"

import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

@Entity({ tableName: "product_option" })
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
  values: ProductOptionValue[]

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "opt")
  }
}

export default ProductOption
