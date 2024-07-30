import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  OrderChangeStatus,
  OrderChangeType,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import {} from "@types"
import OrderClaim from "./claim"
import OrderExchange from "./exchange"
import Order from "./order"
import OrderChangeAction from "./order-change-action"
import Return from "./return"

type OptionalLineItemProps = DAL.ModelDateColumns

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "order_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const OrderClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "claim_id",
  where: "claim_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const OrderExchangeIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "exchange_id",
  where: "exchange_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const OrderChangeStatusIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "status",
  where: "deleted_at IS NOT NULL",
})

const OrderChangeTypeIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "change_type",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const VersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: ["order_id", "version"],
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_change" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
@VersionIndex.MikroORMIndex()
export default class OrderChange {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    columnType: "text",
    fieldName: "order_id",
    onDelete: "cascade",
    mapToPk: true,
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Rel<Order>

  @ManyToOne({
    entity: () => Return,
    mapToPk: true,
    fieldName: "return_id",
    columnType: "text",
    nullable: true,
  })
  @ReturnIdIndex.MikroORMIndex()
  return_id: string | null = null

  @ManyToOne(() => Return, {
    persist: false,
    nullable: true,
  })
  return: Rel<Return>

  @ManyToOne({
    entity: () => OrderClaim,
    mapToPk: true,
    fieldName: "claim_id",
    columnType: "text",
    nullable: true,
  })
  @OrderClaimIdIndex.MikroORMIndex()
  claim_id: string | null = null

  @ManyToOne(() => OrderClaim, {
    persist: false,
    nullable: true,
  })
  claim: OrderClaim

  @ManyToOne({
    entity: () => OrderExchange,
    mapToPk: true,
    fieldName: "exchange_id",
    columnType: "text",
    nullable: true,
  })
  @OrderExchangeIdIndex.MikroORMIndex()
  exchange_id: string | null = null

  @ManyToOne(() => OrderExchange, {
    persist: false,
    nullable: true,
  })
  exchange: OrderExchange

  @Property({ columnType: "integer" })
  @VersionIndex.MikroORMIndex()
  version: number

  @Enum({ items: () => OrderChangeType, nullable: true })
  @OrderChangeTypeIndex.MikroORMIndex()
  change_type: OrderChangeType | null = null

  @OneToMany(() => OrderChangeAction, (action) => action.order_change, {
    cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
  })
  actions = new Collection<Rel<OrderChangeAction>>(this)

  @Property({
    columnType: "text",
    nullable: true,
  })
  description: string | null = null

  @Enum({ items: () => OrderChangeStatus, default: OrderChangeStatus.PENDING })
  @OrderChangeStatusIndex.MikroORMIndex()
  status: OrderChangeStatus = OrderChangeStatus.PENDING

  @Property({ columnType: "text", nullable: true })
  internal_note: string | null = null

  @Property({ columnType: "text", nullable: true })
  created_by: string // customer, user, third party, etc.

  @Property({ columnType: "text", nullable: true })
  requested_by: string | null = null // customer or user ID

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  requested_at: Date | null = null

  @Property({ columnType: "text", nullable: true })
  confirmed_by: string | null = null // customer or user ID

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  confirmed_at: Date | null = null

  @Property({ columnType: "text", nullable: true })
  declined_by: string | null = null // customer or user ID

  @Property({ columnType: "text", nullable: true })
  declined_reason: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  declined_at?: Date

  @Property({ columnType: "text", nullable: true })
  canceled_by: string | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  canceled_at?: Date | null = null

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
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordch")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.claim_id ??= this.claim?.id
    this.exchange_id ??= this.exchange?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordch")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.claim_id ??= this.claim?.id
    this.exchange_id ??= this.exchange?.id
  }
}
