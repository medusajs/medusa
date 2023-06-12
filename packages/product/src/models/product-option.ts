import {
  BeforeCreate,
  Cascade,
  Collection,
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

  @Property({ persist: false })
  product_id!: number

  @ManyToOne(() => Product, {
    index: "IDX_product_option_product_id",
  })
  product: Product

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: [Cascade.REMOVE],
  })
  values = new Collection<ProductOptionValue>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "opt")
  }
}

export default ProductOption
