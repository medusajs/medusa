import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
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
import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

type OptionalRelations =
  | "values"
  | "product"
  | DAL.SoftDeletableEntityDateColumns
type OptionalFields = "product_id"

const optionProductIdTitleIndexName = "IDX_option_product_id_title_unique"
const optionProductIdTitleIndexStatement = createPsqlIndexStatementHelper({
  name: optionProductIdTitleIndexName,
  tableName: "product_option",
  columns: ["product_id", "title"],
  unique: true,
  where: "deleted_at IS NULL",
})

optionProductIdTitleIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_option" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductOption {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @ManyToOne(() => Product, {
    columnType: "text",
    fieldName: "product_id",
    mapToPk: true,
    nullable: true,
    onDelete: "cascade",
  })
  product_id: string | null

  @ManyToOne(() => Product, {
    persist: false,
    nullable: true,
  })
  product: Product | null

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE, "soft-remove" as any],
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

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "opt")
    this.product_id ??= this.product?.id ?? null
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "opt")
    this.product_id ??= this.product?.id ?? null
  }
}

export default ProductOption
