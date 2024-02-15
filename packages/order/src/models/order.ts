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
} from "@mikro-orm/core"
import Address from "./address"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

type OptionalOrderProps =
  | "shipping_address"
  | "billing_address"
  | DAL.EntityDateColumns

const regionIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "region_id",
  where: "deleted_at IS NOT NULL",
})

const customerIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "customer_id",
  where: "deleted_at IS NOT NULL",
})

const salesChannelIdIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "customer_id",
  where: "deleted_at IS NOT NULL",
})

const orderDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const currencyCodeIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "currency_code",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order" })
export default class Order {
  [OptionalProps]?: OptionalOrderProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    columnType: "text",
    nullable: true,
  })
  @regionIdIndex.MikroORMIndex()
  region_id: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @customerIdIndex.MikroORMIndex()
  customer_id: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @salesChannelIdIndex.MikroORMIndex()
  sales_channel_id: string | null = null

  @Enum({ items: () => OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus

  @Property({ columnType: "text", nullable: true })
  email: string | null = null

  @Property({ columnType: "text" })
  @currencyCodeIndex.MikroORMIndex()
  currency_code: string

  @Property({ columnType: "text", nullable: true })
  shipping_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "shipping_address_id",
    nullable: true,
    index: "IDX_order_shipping_address_id",
    cascade: [Cascade.PERSIST],
  })
  shipping_address?: Address | null

  @Property({ columnType: "text", nullable: true })
  billing_address_id?: string | null

  @ManyToOne({
    entity: () => Address,
    fieldName: "billing_address_id",
    nullable: true,
    index: "IDX_order_billing_address_id",
    cascade: [Cascade.PERSIST],
  })
  billing_address?: Address | null

  @Property({ columnType: "boolean", nullable: true })
  no_notification: boolean | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(() => LineItem, (lineItem) => lineItem.order, {
    cascade: [Cascade.REMOVE],
  })
  items = new Collection<LineItem>(this)

  @OneToMany(() => ShippingMethod, (shippingMethod) => shippingMethod.order, {
    cascade: [Cascade.REMOVE],
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

  @Property({ columnType: "timestamptz", nullable: true })
  @orderDeletedAtIndex.MikroORMIndex()
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
