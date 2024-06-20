import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  MikroOrmBigNumberProperty,
  ReturnStatus,
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
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import { ReturnItem, Transaction } from "@models"
import Claim from "./claim"
import Exchange from "./exchange"
import Order from "./order"
import OrderItem from "./order-item"
import OrderShippingMethod from "./order-shipping-method"

type OptionalReturnProps = DAL.EntityDateColumns

const DisplayIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: "display_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const ExchangeIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: ["exchange_id"],
  where: "exchange_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: ["claim_id"],
  where: "claim_id IS NOT NULL AND deleted_at IS NOT NULL",
})

@Entity({ tableName: "return" })
export default class Return {
  [OptionalProps]?: OptionalReturnProps

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
    entity: () => Exchange,
    cascade: ["soft-remove"] as any,
    fieldName: "exchange_id",
    nullable: true,
  })
  exchange: Rel<Exchange>

  @Property({ columnType: "text", nullable: true })
  @ExchangeIdIndex.MikroORMIndex()
  exchange_id: string | null = null

  @OneToOne({
    entity: () => Claim,
    cascade: ["soft-remove"] as any,
    fieldName: "claim_id",
    nullable: true,
  })
  claim: Rel<Claim>

  @Property({ columnType: "text", nullable: true })
  @ClaimIdIndex.MikroORMIndex()
  claim_id: string | null = null

  @Property({
    columnType: "integer",
  })
  order_version: number

  @Property({ autoincrement: true, primary: false })
  @DisplayIdIndex.MikroORMIndex()
  display_id: number

  @Enum({ items: () => ReturnStatus, default: ReturnStatus.REQUESTED })
  status: ReturnStatus = ReturnStatus.REQUESTED

  @Property({ columnType: "boolean", nullable: true })
  no_notification: boolean | null = null

  @MikroOrmBigNumberProperty({
    nullable: true,
  })
  refund_amount: BigNumber | number

  @Property({ columnType: "jsonb", nullable: true })
  raw_refund_amount: BigNumberRawValue

  @OneToMany(() => ReturnItem, (itemDetail) => itemDetail.return, {
    cascade: [Cascade.PERSIST],
  })
  items = new Collection<Rel<OrderItem>>(this)

  @OneToMany(
    () => OrderShippingMethod,
    (shippingMethod) => shippingMethod.return,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  shipping_methods = new Collection<OrderShippingMethod>(this)

  @OneToMany(() => Transaction, (transaction) => transaction.return, {
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
  @ReturnDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  received_at: Date | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  canceled_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "return")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "return")
  }
}
