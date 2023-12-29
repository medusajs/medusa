import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Cart from "./cart"
import LineItemAdjustmentLine from "./line-item-adjustment-line"
import LineItemTaxLine from "./line-item-tax-line"

@Entity({ tableName: "line_item" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItem {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  cart_id: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text", nullable: true })
  subtitle: string | null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null

  @Property({ columnType: "text" })
  quantity: number

  @Property({ columnType: "text", nullable: true })
  variant_id: string | null

  @Property({ columnType: "text", nullable: true })
  product_id: string | null

  @Property({ columnType: "text", nullable: true })
  product_title: string | null

  @Property({ columnType: "text", nullable: true })
  product_description: string | null

  @Property({ columnType: "text", nullable: true })
  product_subtitle: string | null

  @Property({ columnType: "text", nullable: true })
  product_type: string | null

  @Property({ columnType: "text", nullable: true })
  product_collection: string | null

  @Property({ columnType: "text", nullable: true })
  product_handle: string | null

  @Property({ columnType: "text", nullable: true })
  variant_sku: string | null

  @Property({ columnType: "text", nullable: true })
  variant_barcode: string | null

  @Property({ columnType: "text", nullable: true })
  variant_title: string | null

  @Property({ columnType: "jsonb", nullable: true })
  variant_option_values: Record<string, unknown> | null

  @Property({ columnType: "boolean", nullable: true })
  requires_shipping: boolean | null

  @Property({ columnType: "boolean", nullable: true })
  is_discountable: boolean | null

  @Property({ columnType: "boolean", nullable: true })
  is_tax_inclusive: boolean | null

  @Property({ columnType: "text", nullable: true })
  compare_at_unit_price: number | null

  @Property({ columnType: "numeric" })
  unit_price: number

  @ManyToOne(() => Cart, {
    onDelete: "cascade",
    index: "IDX_line_item_cart_id",
    fieldName: "cart_id",
  })
  cart!: Cart

  @OneToMany(() => LineItemTaxLine, (taxLine) => taxLine.line_item, {
    cascade: ["soft-remove"] as any,
  })
  tax_lines = new Collection<LineItemTaxLine>(this)

  @OneToMany(
    () => LineItemAdjustmentLine,
    (adjustment) => adjustment.line_item,
    {
      cascade: ["soft-remove"] as any,
    }
  )
  adjustments = new Collection<LineItemAdjustmentLine>(this)

  compare_at_total: number
  compare_at_subtotal: number
  compare_at_tax_total: number

  original_total: number
  original_subtotal: number
  original_tax_total: number

  item_total: number
  item_subtotal: number
  item_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number

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

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "li")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "li")
  }
}
