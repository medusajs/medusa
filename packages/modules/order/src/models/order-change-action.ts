import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Order from "./order"
import OrderChange from "./order-change"
import Return from "./return"

type OptionalLineItemProps = DAL.EntityDateColumns

const OrderChangeIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change_action",
  columns: "order_change_id",
  where: "deleted_at IS NOT NULL",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change_action",
  columns: "order_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_change_action",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_change_action",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ActionOrderingIndex = createPsqlIndexStatementHelper({
  tableName: "order_change_action",
  columns: "ordering",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_change_action" })
export default class OrderChangeAction {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "integer", autoincrement: true })
  @ActionOrderingIndex.MikroORMIndex()
  ordering: number

  @ManyToOne({
    entity: () => Order,
    columnType: "text",
    fieldName: "order_id",
    onDelete: "cascade",
    mapToPk: true,
    nullable: true,
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string | null = null

  @ManyToOne(() => Order, {
    persist: false,
    nullable: true,
  })
  order: Order | null = null

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
  })
  return: Return

  @Property({ columnType: "integer", nullable: true })
  version: number | null = null

  @ManyToOne({
    entity: () => OrderChange,
    columnType: "text",
    fieldName: "order_change_id",
    onDelete: "cascade",
    mapToPk: true,
    nullable: true,
  })
  @OrderChangeIdIndex.MikroORMIndex()
  order_change_id: string | null

  @ManyToOne(() => OrderChange, {
    persist: false,
    nullable: true,
  })
  order_change: OrderChange | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  reference: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  reference_id: string | null = null

  @Property({ columnType: "text" })
  action: string

  @Property({ columnType: "jsonb" })
  details: Record<string, unknown> = {}

  @MikroOrmBigNumberProperty({ nullable: true })
  amount: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_amount: BigNumberRawValue | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  internal_note: string | null = null

  @Property({
    columnType: "boolean",
    defaultRaw: "false",
  })
  applied: boolean = false

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
    this.id = generateEntityId(this.id, "ordchact")
    this.order_id ??= this.order?.id ?? this.order_change?.order_id ?? null
    this.order_change_id ??= this.order_change?.id ?? null
    this.version ??= this.order_change?.version ?? null
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordchact")
    this.order_id ??= this.order?.id ?? this.order_change?.order_id ?? null
    this.order_change_id ??= this.order_change?.id ?? null
    this.version ??= this.order_change?.version ?? null
  }
}
