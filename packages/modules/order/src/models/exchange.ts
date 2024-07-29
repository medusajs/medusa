import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OnInit,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import { OrderExchangeItem, Transaction } from "@models"
import Order from "./order"
import OrderShippingMethod from "./order-shipping-method"
import Return from "./return"

type OptionalOrderExchangeProps = DAL.ModelDateColumns

const DisplayIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange",
  columns: "display_id",
  where: "deleted_at IS NOT NULL",
})

const OrderExchangeDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange",
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_exchange" })
export default class OrderExchange {
  [OptionalProps]?: OptionalOrderExchangeProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    mapToPk: true,
    fieldName: "order_id",
    columnType: "text",
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Rel<Order>

  @OneToOne({
    entity: () => Return,
    mappedBy: (ret) => ret.exchange,
    fieldName: "return_id",
    nullable: true,
    owner: true,
  })
  return: Rel<Return>

  @Property({ columnType: "text", nullable: true })
  @ReturnIdIndex.MikroORMIndex()
  return_id: string | null = null

  @Property({
    columnType: "integer",
  })
  order_version: number

  @Property({ autoincrement: true, primary: false })
  @DisplayIdIndex.MikroORMIndex()
  display_id: number

  @Property({ columnType: "boolean", nullable: true })
  no_notification: boolean | null = null

  @MikroOrmBigNumberProperty({
    nullable: true,
  })
  difference_due: BigNumber | number

  @Property({ columnType: "jsonb", nullable: true })
  raw_difference_due: BigNumberRawValue

  @Property({ columnType: "boolean", default: false })
  allow_backorder: boolean = false

  @OneToMany(() => OrderExchangeItem, (item) => item.exchange, {
    cascade: [Cascade.PERSIST],
  })
  additional_items = new Collection<Rel<OrderExchangeItem>>(this)

  @OneToMany(
    () => OrderShippingMethod,
    (shippingMethod) => shippingMethod.exchange,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  shipping_methods = new Collection<Rel<OrderShippingMethod>>(this)

  @OneToMany(() => Transaction, (transaction) => transaction.exchange, {
    cascade: [Cascade.PERSIST],
  })
  transactions = new Collection<Transaction>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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
  @OrderExchangeDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  canceled_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "oexc")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "oexc")
  }
}
