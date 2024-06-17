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
  ManyToMany,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ProductOption, ProductVariant } from "./index"

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
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @ManyToOne(() => ProductOption, {
    columnType: "text",
    fieldName: "option_id",
    mapToPk: true,
    nullable: true,
    onDelete: "cascade",
  })
  option_id: string | null

  @ManyToOne(() => ProductOption, {
    nullable: true,
    persist: false,
  })
  option: ProductOption | null

  @ManyToMany(() => ProductVariant, (variant) => variant.options)
  variants = new Collection<ProductVariant>(this)

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
  @BeforeCreate()
  onInit() {
    this.id = generateEntityId(this.id, "optval")
    this.option_id ??= this.option?.id ?? null
  }
}

export default ProductOptionValue
