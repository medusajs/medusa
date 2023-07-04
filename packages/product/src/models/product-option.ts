import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"
import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

type OptionalRelations = "values" | "product"
type OptionalFields = "deleted_at" | "product_id"

@Entity({ tableName: "product_option" })
class ProductOption {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ persist: false })
  product_id!: string

  @ManyToOne(() => Product, {
    index: "IDX_product_option_product_id",
    fieldName: "product_id",
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
