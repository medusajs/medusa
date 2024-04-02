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

  @ManyToOne(() => ProductOption, {
    columnType: "text",
    fieldName: "option_id",
    mapToPk: true,
    nullable: true,
    index: "IDX_product_option_value_option_id",
    onDelete: "cascade",
  })
  option_id: string | null

  @ManyToOne(() => ProductOption, {
    nullable: true,
    persist: false,
  })
  option: ProductOption | null

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
    this.option_id ??= this.option?.id ?? null
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "optval")
    this.option_id ??= this.option?.id ?? null
  }
}

export default ProductOptionValue
