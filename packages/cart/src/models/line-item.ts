import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Cart from "./cart"
import LineItemAdjustment from "./line-item-adjustment"
import LineItemTaxLine from "./line-item-tax-line"

type OptionalLineItemProps =
  | "is_discoutable"
  | "is_tax_inclusive"
  | "compare_at_unit_price"
  | "requires_shipping"
  | "cart"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "cart_line_item" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  cart_id: string

  @ManyToOne({
    entity: () => Cart,
    onDelete: "cascade",
    index: "IDX_line_item_cart_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  cart: Cart

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null = null

  @Property({ columnType: "integer" })
  quantity: number

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_line_item_variant_id",
  })
  variant_id: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_line_item_product_id",
  })
  product_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_title: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_description: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_subtitle: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_type: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_collection: string | null = null

  @Property({ columnType: "text", nullable: true })
  product_handle: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_sku: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_barcode: string | null = null

  @Property({ columnType: "text", nullable: true })
  variant_title: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  variant_option_values: Record<string, unknown> | null = null

  @Property({ columnType: "boolean" })
  requires_shipping = true

  @Property({ columnType: "boolean" })
  is_discountable = true

  @Property({ columnType: "boolean" })
  is_tax_inclusive = false

  @Property({ columnType: "numeric", nullable: true })
  compare_at_unit_price?: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_compare_at_unit_price: BigNumberRawValue | null = null

  @Property({ columnType: "numeric" })
  unit_price: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_unit_price: BigNumberRawValue

  @OneToMany(() => LineItemTaxLine, (taxLine) => taxLine.item, {
    cascade: [Cascade.REMOVE],
  })
  tax_lines = new Collection<LineItemTaxLine>(this)

  @OneToMany(() => LineItemAdjustment, (adjustment) => adjustment.item, {
    cascade: [Cascade.REMOVE],
  })
  adjustments = new Collection<LineItemAdjustment>(this)

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

  @createPsqlIndexStatementHelper({
    tableName: "cart_line_item",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cali")

    const val = new BigNumber(this.raw_unit_price ?? this.unit_price)

    this.unit_price = val.numeric
    this.raw_unit_price = val.raw!
  }

  @BeforeUpdate()
  onUpdate() {
    const val = new BigNumber(this.raw_unit_price ?? this.unit_price)

    this.unit_price = val.numeric
    this.raw_unit_price = val.raw as BigNumberRawValue
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cali")

    const val = new BigNumber(this.raw_unit_price ?? this.unit_price)

    this.unit_price = val.numeric
    this.raw_unit_price = val.raw!
  }
}
