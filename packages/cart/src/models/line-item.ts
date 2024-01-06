import { DAL } from "@medusajs/types"
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
  OptionalProps,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import Cart from "./cart"
import LineItemAdjustmentLine from "./line-item-adjustment-line"
import LineItemTaxLine from "./line-item-tax-line"

type OptionalLineItemProps =
  | "is_discoutable"
  | "is_tax_inclusive"
  | "compare_at_unit_price"
  | "requires_shipping"
  | DAL.EntityDateColumns

@Entity({ tableName: "cart_line_item" })
export default class LineItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne(() => Cart, {
    onDelete: "cascade",
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
  requires_shipping = true

  @Property({ columnType: "boolean" })
  is_discountable = true

  @Property({ columnType: "boolean" })
  is_tax_inclusive = false

  @Property({ columnType: "numeric", nullable: true })
  compare_at_unit_price?: number

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
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cali")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cali")
  }
}
