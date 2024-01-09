import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Check,
  Collection,
  Entity,
  ManyToOne,
  OnInit,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Cart from "./cart"
import LineItemAdjustmentLine from "./line-item-adjustment-line"
import LineItemTaxLine from "./line-item-tax-line"

@Entity({ tableName: "cart_line_item" })
export default class LineItem {
  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne(() => Cart, {
    cascade: [Cascade.REMOVE],
    index: "IDX_line_item_cart_id",
    fieldName: "cart_id",
  })
  cart!: Cart

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null

  @Property({ columnType: "text", nullable: true })
  thumbnail?: string | null

  @Property({ columnType: "text" })
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
  requires_shipping: Opt<boolean> = true

  @Property({ columnType: "boolean" })
  is_discountable: Opt<boolean> = true

  @Property({ columnType: "boolean" })
  is_tax_inclusive: Opt<boolean> = false

  @Property({ columnType: "numeric", nullable: true })
  compare_at_unit_price?: Opt<number>

  @Property({ columnType: "numeric", serializer: Number })
  @Check({ expression: "unit_price >= 0" }) // TODO: Validate that numeric types work with the expression
  unit_price: number

  @OneToMany(() => LineItemTaxLine, (taxLine) => taxLine.line_item, {
    cascade: [Cascade.REMOVE],
  })
  tax_lines = new Collection<LineItemTaxLine>(this)

  @OneToMany(
    () => LineItemAdjustmentLine,
    (adjustment) => adjustment.line_item,
    {
      cascade: [Cascade.REMOVE],
    }
  )
  adjustments = new Collection<LineItemAdjustmentLine>(this)

  /** COMPUTED PROPERTIES - START */

  // compare_at_total?: number
  // compare_at_subtotal?: number
  // compare_at_tax_total?: number

  // original_total: number
  // original_subtotal: number
  // original_tax_total: number

  // item_total: number
  // item_subtotal: number
  // item_tax_total: number

  // total: number
  // subtotal: number
  // tax_total: number
  // discount_total: number
  // discount_tax_total: number

  /** COMPUTED PROPERTIES - END */

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Opt<Date>

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Opt<Date>

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cali")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cali")
  }
}
