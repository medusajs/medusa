import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
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
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

type OptionalCartProps =
  | "shipping_address"
  | "billing_address"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "cart" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Cart {
  [OptionalProps]?: OptionalCartProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @createPsqlIndexStatementHelper({
    name: "IDX_cart_region_id",
    tableName: "cart",
    columns: "region_id",
    where: "deleted_at IS NULL AND region_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  region_id: string | null = null

  @createPsqlIndexStatementHelper({
    name: "IDX_cart_customer_id",
    tableName: "cart",
    columns: "customer_id",
    where: "deleted_at IS NULL AND customer_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  customer_id: string | null = null

  @createPsqlIndexStatementHelper({
    name: "IDX_cart_sales_channel_id",
    tableName: "cart",
    columns: "sales_channel_id",
    where: "deleted_at IS NULL AND sales_channel_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_cart_sales_channel_id",
  })
  sales_channel_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  email: string | null = null

  @Property({ columnType: "text", index: "IDX_cart_curency_code" })
  currency_code: string

  @createPsqlIndexStatementHelper({
    name: "IDX_cart_shipping_address_id",
    tableName: "cart",
    columns: "shipping_address_id",
    where: "deleted_at IS NULL AND shipping_address_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  shipping_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "shipping_address_id",
    nullable: true,
    cascade: [Cascade.PERSIST],
  })
  shipping_address?: Address | null

  @createPsqlIndexStatementHelper({
    name: "IDX_cart_billing_address_id",
    tableName: "cart",
    columns: "billing_address_id",
    where: "deleted_at IS NULL AND billing_address_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  billing_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "billing_address_id",
    nullable: true,
    index: "IDX_cart_billing_address_id",
    cascade: [Cascade.PERSIST],
  })
  billing_address?: Address | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  items = new Collection<LineItem>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.cart, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  shipping_methods = new Collection<ShippingMethod>(this)

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
    tableName: "cart",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cart")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cart")
  }
}
