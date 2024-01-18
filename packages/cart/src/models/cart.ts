import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

type OptionalCartProps =
  | "shipping_address"
  | "billing_address"
  | DAL.EntityDateColumns

@Entity({ tableName: "cart" })
export default class Cart {
  [OptionalProps]?: OptionalCartProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  region_id?: string | null

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_cart_customer_id",
  })
  customer_id?: string | null

  @Property({ columnType: "text", nullable: true })
  sales_channel_id?: string | null

  @Property({ columnType: "text", nullable: true })
  email?: string | null

  @Property({ columnType: "text" })
  currency_code: string

  @Index({ name: "IDX_cart_shipping_address_id" })
  @Property({ columnType: "text", nullable: true })
  shipping_address_id?: string | null

  @ManyToOne(() => Address, {
    fieldName: "shipping_address_id",
    nullable: true,
  })
  shipping_address?: Address | null

  @Index({ name: "IDX_cart_billing_address_id" })
  @Property({ columnType: "text", nullable: true })
  billing_address_id?: string | null

  @ManyToOne(() => Address, {
    fieldName: "billing_address_id",
    nullable: true,
  })
  billing_address?: Address | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: [Cascade.REMOVE],
  })
  items = new Collection<LineItem>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.cart, {
    cascade: [Cascade.REMOVE],
  })
  shipping_methods = new Collection<ShippingMethod>(this)

  /** COMPUTED PROPERTIES - START */

  // compare_at_item_total?: number
  // compare_at_item_subtotal?: number
  // compare_at_item_tax_total?: number

  // original_item_total: number
  // original_item_subtotal: number
  // original_item_tax_total: number

  // item_total: number
  // item_subtotal: number
  // item_tax_total: number

  // original_total: number
  // original_subtotal: number
  // original_tax_total: number

  // total: number
  // subtotal: number
  // tax_total: number
  // discount_total: number
  // discount_tax_total: number

  // shipping_total: number
  // shipping_subtotal: number
  // shipping_tax_total: number

  // original_shipping_total: number
  // original_shipping_subtotal: number
  // original_shipping_tax_total: number

  /** COMPUTED PROPERTIES - END */

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
    this.id = generateEntityId(this.id, "cart")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cart")
  }
}
