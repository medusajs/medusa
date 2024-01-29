import { DAL } from "@medusajs/types"
import { BigNumber, BigNumberRawValue, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OnInit,
  OnLoad,
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
  | DAL.EntityDateColumns

@Entity({ tableName: "cart_line_item" })
export default class LineItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  cart_id: string

  @ManyToOne(() => Cart, {
    onDelete: "cascade",
    index: "IDX_line_item_cart_id",
    nullable: true,
  })
  cart?: Cart | null

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null

  @Property({ columnType: "text", nullable: true })
  thumbnail?: string | null

  @Property({ columnType: "integer" })
  quantity: number

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_line_item_variant_id",
  })
  variant_id?: string | null

  @Property({ columnType: "text", nullable: true })
  product_id?: string | null

  @Property({ columnType: "text", nullable: true })
  product_title?: string | null

  @Property({ columnType: "text", nullable: true })
  product_description?: string | null

  @Property({ columnType: "text", nullable: true })
  product_subtitle?: string | null

  @Property({ columnType: "text", nullable: true })
  product_type?: string | null

  @Property({ columnType: "text", nullable: true })
  product_collection?: string | null

  @Property({ columnType: "text", nullable: true })
  product_handle?: string | null

  @Property({ columnType: "text", nullable: true })
  variant_sku?: string | null

  @Property({ columnType: "text", nullable: true })
  variant_barcode?: string | null

  @Property({ columnType: "text", nullable: true })
  variant_title?: string | null

  @Property({ columnType: "jsonb", nullable: true })
  variant_option_values?: Record<string, unknown> | null

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
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cali")

    const val = (this.raw_unit_price ?? this.unit_price) as BigNumberRawValue

    this.raw_unit_price = new BigNumber(val).raw!
  }

  @BeforeUpdate()
  onUpdate() {
    const val = new BigNumber(this.raw_unit_price ?? this.unit_price)

    this.unit_price = val.numeric
    this.raw_unit_price = val.raw as BigNumberRawValue
  }

  @OnLoad()
  onLoad() {
    this.unit_price = new BigNumber(this.raw_unit_price)
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cali")

    const val = (this.raw_unit_price ?? this.unit_price) as BigNumberRawValue

    this.raw_unit_price = new BigNumber(val).raw!

    if (this.raw_unit_price && !("value" in this.raw_unit_price)) {
      throw Error("Property `value` is required in `raw_unit_price`")
    }
  }
}
