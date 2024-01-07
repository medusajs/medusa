import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  OnInit,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

type OptionalCartProps =
  | "shipping_address"
  | "billing_address"
  | DAL.EntityDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "cart" })
export default class Cart {
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

  @OneToOne({
    entity: () => Address,
    joinColumn: "shipping_address_id",
    cascade: [Cascade.REMOVE],
    nullable: true,
  })
  shipping_address?: Address | null

  @OneToOne({
    entity: () => Address,
    joinColumn: "billing_address_id",
    cascade: [Cascade.REMOVE],
    nullable: true,
  })
  billing_address?: Address | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    orphanRemoval: true,
  })
  items = new Collection<LineItem>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.cart, {
    orphanRemoval: true,
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
    this.id = generateEntityId(this.id, "cart")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cart")
  }
}
