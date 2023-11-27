import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

type OptionalRelations =
  | "values"
  | "product"
  | DAL.SoftDeletableEntityDateColumns
type OptionalFields = "product_id"

@Entity({ tableName: "product_option" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductOption {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  product_id!: string

  @ManyToOne(() => Product, {
    index: "IDX_product_option_product_id",
    fieldName: "product_id",
    nullable: true,
  })
  product!: Product

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: [Cascade.REMOVE, "soft-remove" as any],
  })
  values = new Collection<ProductOptionValue>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_product_option_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "opt")
  }
}

export default ProductOption
