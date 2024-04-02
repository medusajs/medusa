import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ProductOptionValue, ProductVariant } from "./index"

const variantOptionValueIndexName = "IDX_variant_option_option_value_unique"
const variantOptionValueIndexStatement = createPsqlIndexStatementHelper({
  name: variantOptionValueIndexName,
  tableName: "product_variant_option",
  columns: ["variant_id", "option_value_id"],
  unique: true,
  where: "deleted_at IS NULL",
})

variantOptionValueIndexStatement.MikroORMIndex()
@Entity({ tableName: "product_variant_option" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductVariantOption {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => ProductOptionValue, {
    columnType: "text",
    nullable: true,
    fieldName: "option_value_id",
    mapToPk: true,
  })
  option_value_id!: string

  @ManyToOne(() => ProductOptionValue, {
    persist: false,
    nullable: true,
  })
  option_value!: ProductOptionValue

  @ManyToOne(() => ProductVariant, {
    columnType: "text",
    nullable: true,
    fieldName: "variant_id",
    mapToPk: true,
  })
  variant_id: string | null

  @ManyToOne(() => ProductVariant, {
    persist: false,
    nullable: true,
  })
  variant!: ProductVariant

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

  @Index({ name: "IDX_product_variant_option_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "varopt")
    this.variant_id ??= this.variant?.id ?? null
    this.option_value_id ??= this.option_value?.id ?? null
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "varopt")
    this.variant_id ??= this.variant?.id ?? null
    this.option_value_id ??= this.option_value?.id ?? null
  }
}

export default ProductVariantOption
