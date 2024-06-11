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
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { OrderItem, OrderShippingMethod } from "@models"
import Order from "./order"

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

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: ["claim_id"],
  where: "claim_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ExchageIdIndex = createPsqlIndexStatementHelper({
  tableName: "return",
  columns: ["exchange_id"],
  where: "exchange_id IS NOT NULL AND deleted_at IS NOT NULL",
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
  order: Order

  /*
  @ManyToOne({
    entity: () => Claim,
    mapToPk: true,
    fieldName: "claim_id",
    columnType: "text",
    nullable: true,
  })
  @ClaimIdIndex.MikroORMIndex()
  claim_id: string | null

  @ManyToOne(() => Claim, {
    persist: false,
  })
  claim: Claim | null

  @ManyToOne({
    entity: () => Exchange,
    mapToPk: true,
    fieldName: "exchange_id",
    columnType: "text",
    nullable: true,
  })
  @ExchangeIdIndex.MikroORMIndex()
  exchange_id: string | null

  @ManyToOne(() => Exchange, {
    persist: false,
  })
  exchange: Exchange | null
  */

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

  @OneToMany(() => OrderItem, (itemDetail) => itemDetail.return, {
    cascade: [Cascade.PERSIST],
  })
  items = new Collection<OrderItem>(this)

  @OneToMany(
    () => OrderShippingMethod,
    (shippingMethod) => shippingMethod.return,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  shipping_methods = new Collection<OrderShippingMethod>(this)

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
