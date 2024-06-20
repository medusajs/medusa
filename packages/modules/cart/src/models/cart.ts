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
  Rel,
} from "@mikro-orm/core"
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

type OptionalCartProps =
  | "shipping_address"
  | "billing_address"
  | DAL.SoftDeletableEntityDateColumns

const RegionIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_region_id",
  tableName: "cart",
  columns: "region_id",
  where: "deleted_at IS NULL AND region_id IS NOT NULL",
}).MikroORMIndex

const CustomerIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_customer_id",
  tableName: "cart",
  columns: "customer_id",
  where: "deleted_at IS NULL AND customer_id IS NOT NULL",
}).MikroORMIndex

const SalesChannelIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_sales_channel_id",
  tableName: "cart",
  columns: "sales_channel_id",
  where: "deleted_at IS NULL AND sales_channel_id IS NOT NULL",
}).MikroORMIndex

const CurrencyCodeIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_curency_code",
  tableName: "cart",
  columns: "currency_code",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const ShippingAddressIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_shipping_address_id",
  tableName: "cart",
  columns: "shipping_address_id",
  where: "deleted_at IS NULL AND shipping_address_id IS NOT NULL",
}).MikroORMIndex

const BillingAddressIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_cart_billing_address_id",
  tableName: "cart",
  columns: "billing_address_id",
  where: "deleted_at IS NULL AND billing_address_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Cart {
  [OptionalProps]?: OptionalCartProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @RegionIdIndex()
  @Property({ columnType: "text", nullable: true })
  region_id: string | null = null

  @CustomerIdIndex()
  @Property({ columnType: "text", nullable: true })
  customer_id: string | null = null

  @SalesChannelIdIndex()
  @Property({ columnType: "text", nullable: true })
  sales_channel_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  email: string | null = null

  @CurrencyCodeIndex()
  @Property({ columnType: "text" })
  currency_code: string

  @ShippingAddressIdIndex()
  @ManyToOne({
    entity: () => Address,
    columnType: "text",
    fieldName: "shipping_address_id",
    mapToPk: true,
    nullable: true,
  })
  shipping_address_id: string | null

  @ManyToOne(() => Address, {
    cascade: [Cascade.PERSIST],
    nullable: true,
  })
  shipping_address: Rel<Address> | null

  @BillingAddressIdIndex()
  @ManyToOne({
    entity: () => Address,
    columnType: "text",
    fieldName: "billing_address_id",
    mapToPk: true,
    nullable: true,
  })
  billing_address_id: string | null

  @ManyToOne(() => Address, {
    cascade: [Cascade.PERSIST],
    nullable: true,
  })
  billing_address: Rel<Address> | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  items = new Collection<Rel<LineItem>>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.cart, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  shipping_methods = new Collection<Rel<ShippingMethod>>(this)

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

  @DeletedAtIndex()
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
