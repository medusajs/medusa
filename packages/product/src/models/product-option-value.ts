import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ProductOption, ProductVariant, ProductVariantOption } from "./index"

type OptionalFields =
  | "allow_backorder"
  | "manage_inventory"
  | "option_id"
  | DAL.SoftDeletableEntityDateColumns
type OptionalRelations = "product" | "option" | "variant"

const optionValueOptionIdIndexName = "IDX_option_value_option_id_unique"
const optionValueOptionIdIndexStatement = createPsqlIndexStatementHelper({
  name: optionValueOptionIdIndexName,
  tableName: "product_option_value",
  columns: ["option_id", "value"],
  unique: true,
  where: "deleted_at IS NULL",
})

optionValueOptionIdIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_option_value" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductOptionValue {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "text", nullable: true })
  option_id!: string

  @ManyToOne(() => ProductOption, {
    index: "IDX_product_option_value_option_id",
    fieldName: "option_id",
  })
  option: ProductOption

  @OneToMany(() => ProductVariantOption, (value) => value.option_value, {})
  variant_options = new Collection<ProductVariantOption>(this)

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

  @Index({ name: "IDX_product_option_value_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "optval")
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "optval")
  }
}

export default ProductOptionValue
