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
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Cart from "./cart"
import ShippingMethodAdjustmentLine from "./shipping-method-adjustment-line"
import ShippingMethodTaxLine from "./shipping-method-tax-line"

@Entity({ tableName: "cart_shipping_method" })
export default class ShippingMethod {
  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne(() => Cart, {
    onDelete: "cascade",
    index: "IDX_shipping_method_cart_id",
    fieldName: "cart_id",
  })
  cart: Cart

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "jsonb", nullable: true })
  description?: string | null

  @Property({ columnType: "numeric", serializer: Number })
  @Check({ expression: "amount >= 0" }) // TODO: Validate that numeric types work with the expression
  amount: number

  @Property({ columnType: "boolean" })
  tax_inclusive = false

  @Property({ columnType: "text", nullable: true })
  shipping_option_id?: string | null

  @Property({ columnType: "jsonb", nullable: true })
  data?: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @OneToMany(
    () => ShippingMethodTaxLine,
    (taxLine) => taxLine.shipping_method,
    {
      cascade: [Cascade.REMOVE],
    }
  )
  tax_lines = new Collection<ShippingMethodTaxLine>(this)

  @OneToMany(
    () => ShippingMethodAdjustmentLine,
    (adjustment) => adjustment.shipping_method,
    {
      cascade: [Cascade.REMOVE],
    }
  )
  adjustments = new Collection<ShippingMethodAdjustmentLine>(this)

  /** COMPUTED PROPERTIES - START */

  // original_total: number
  // original_subtotal: number
  // original_tax_total: number

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
    this.id = generateEntityId(this.id, "casm")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casm")
  }
}
