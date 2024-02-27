import { DAL } from "@medusajs/types"
import {
  OrderChangeStatus,
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
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { OneToMany } from "typeorm"
import Order from "./order"
import OrderChangeAction from "./order-change-action"

type OptionalLineItemProps = DAL.EntityDateColumns

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "order_id",
})

const OrderChangeStatusIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: "status",
})

const VersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_change",
  columns: ["order_id", "version"],
})

@Entity({ tableName: "order_change" })
@VersionIndex.MikroORMIndex()
export default class OrderChange {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne({
    entity: () => Order,
    fieldName: "order_id",
    cascade: [Cascade.REMOVE],
  })
  order: Order

  @Property({ columnType: "integer" })
  @VersionIndex.MikroORMIndex()
  version: number

  @OneToMany(() => OrderChangeAction, (action) => action.order_change_id, {
    cascade: [Cascade.REMOVE],
  })
  actions = new Collection<OrderChangeAction>(this)

  @Property({
    columnType: "text",
    nullable: true,
  })
  description: string | null = null

  @Enum({ items: () => OrderChangeStatus, default: OrderChangeStatus.PENDING })
  @OrderChangeStatusIndex.MikroORMIndex()
  status: OrderChangeStatus

  @Property({ columnType: "text", nullable: true })
  internal_note: string | null = null

  @Property({ columnType: "text" })
  created_by: string // customer, user, third party, etc.

  @Property({ columnType: "text", nullable: true })
  requested_by: string | null = null // customer or user ID

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  requested_at?: Date

  @Property({ columnType: "text", nullable: true })
  confirmed_by: string | null = null // customer or user ID

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  confirmed_at?: Date

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
  canceled_at?: Date

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
    this.id = generateEntityId(this.id, "ordch")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordch")
  }
}
