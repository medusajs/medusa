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
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "cart" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Cart {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  region_id: string

  @Property({ columnType: "text" })
  customer_id: string

  @Property({ columnType: "text" })
  sales_channel_id: string

  @Property({ columnType: "text" })
  email: string

  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "text", nullable: true })
  shipping_address_id!: string

  @ManyToOne(() => Address, {
    nullable: true,
    fieldName: "shipping_address_id",
  })
  shipping_address!: Address | null

  @Property({ columnType: "text", nullable: true })
  billing_address_id!: string

  @ManyToOne(() => Address, {
    nullable: true,
    fieldName: "billing_address_id",
  })
  billing_address!: Address | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: ["soft-remove"] as any,
  })
  items = new Collection<LineItem>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.cart, {
    cascade: ["soft-remove"] as any,
  })
  shipping_methods = new Collection<ShippingMethod>(this)

  compare_at_item_total: number
  compare_at_item_subtotal: number
  compare_at_item_tax_total: number

  original_item_total: number
  original_item_subtotal: number
  original_item_tax_total: number

  item_total: number
  item_subtotal: number
  item_tax_total: number

  original_total: number
  original_subtotal: number
  original_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number

  shipping_total: number
  shipping_subtotal: number
  shipping_tax_total: number

  original_shipping_total: number
  original_shipping_subtotal: number
  original_shipping_tax_total: number

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
