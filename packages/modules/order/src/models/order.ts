import { DAL } from "@medusajs/types"
import {
  OrderStatus,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Address from "./address"
import OrderItem from "./order-item"
import OrderShippingMethod from "./order-shipping-method"
import OrderSummary from "./order-summary"
import Transaction from "./transaction"

type OptionalOrderProps =
  | "shipping_address"
  | "billing_address"
  | DAL.ModelDateColumns

const DisplayIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "display_id",
  where: "deleted_at IS NOT NULL",
})

const RegionIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "region_id",
  where: "deleted_at IS NOT NULL",
})

const CustomerIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "customer_id",
  where: "deleted_at IS NOT NULL",
})

const SalesChannelIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "customer_id",
  where: "deleted_at IS NOT NULL",
})

const OrderDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const CurrencyCodeIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "currency_code",
  where: "deleted_at IS NOT NULL",
})

const ShippingAddressIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "shipping_address_id",
  where: "deleted_at IS NOT NULL",
})

const BillingAddressIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "billing_address_id",
  where: "deleted_at IS NOT NULL",
})

const IsDraftOrderIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "is_draft_order",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order" })
export default class Order {
  [OptionalProps]?: OptionalOrderProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ autoincrement: true, primary: false })
  @DisplayIdIndex.MikroORMIndex()
  display_id: number

  @Property({
    columnType: "text",
    nullable: true,
  })
  @RegionIdIndex.MikroORMIndex()
  region_id: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @CustomerIdIndex.MikroORMIndex()
  customer_id: string | null = null

  @Property({
    columnType: "integer",
    defaultRaw: "1",
  })
  version: number = 1

  @Property({
    columnType: "text",
    nullable: true,
  })
  @SalesChannelIdIndex.MikroORMIndex()
  sales_channel_id: string | null = null

  @Enum({ items: () => OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus

  @Property({
    columnType: "boolean",
  })
  @IsDraftOrderIndex.MikroORMIndex()
  is_draft_order: boolean = false

  @Property({ columnType: "text", nullable: true })
  email: string | null = null

  @Property({ columnType: "text" })
  @CurrencyCodeIndex.MikroORMIndex()
  currency_code: string

  @Property({ columnType: "text", nullable: true })
  @ShippingAddressIdIndex.MikroORMIndex()
  shipping_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "shipping_address_id",
    nullable: true,
    cascade: [Cascade.PERSIST],
  })
  shipping_address?: Rel<Address> | null

  @Property({ columnType: "text", nullable: true })
  @BillingAddressIdIndex.MikroORMIndex()
  billing_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "billing_address_id",
    nullable: true,
    cascade: [Cascade.PERSIST],
  })
  billing_address?: Rel<Address> | null

  @Property({ columnType: "boolean", nullable: true })
  no_notification: boolean | null = null

  @OneToMany(() => OrderSummary, (summary) => summary.order, {
    cascade: [Cascade.PERSIST],
  })
  summary = new Collection<Rel<OrderSummary>>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(() => OrderItem, (itemDetail) => itemDetail.order, {
    cascade: [Cascade.PERSIST],
  })
  items = new Collection<Rel<OrderItem>>(this)

  @OneToMany(
    () => OrderShippingMethod,
    (shippingMethod) => shippingMethod.order,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  shipping_methods = new Collection<Rel<OrderShippingMethod>>(this)

  @OneToMany(() => Transaction, (transaction) => transaction.order, {
    cascade: [Cascade.PERSIST],
  })
  transactions = new Collection<Rel<Transaction>>(this)

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

  @Property({ columnType: "timestamptz", nullable: true })
  @OrderDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  canceled_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "order")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "order")
  }
}
