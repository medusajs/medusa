import { BigNumberRawValue, DAL } from "@medusajs/framework/types"
import {
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import OrderLineItem from "./line-item"
import Return from "./return"
import ReturnReason from "./return-reason"

type OptionalLineItemProps = DAL.ModelDateColumns

const tableName = "return_item"
const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "return_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnReasonIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "reason_id",
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "item_id",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
export default class ReturnItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne(() => ReturnReason, {
    columnType: "text",
    fieldName: "reason_id",
    mapToPk: true,
    nullable: true,
  })
  @ReturnReasonIdIndex.MikroORMIndex()
  reason_id: string | null = null

  @ManyToOne(() => ReturnReason, {
    persist: false,
  })
  reason: ReturnReason

  @MikroOrmBigNumberProperty()
  quantity: Number | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  received_quantity: Number | number = 0

  @Property({ columnType: "jsonb" })
  raw_received_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  damaged_quantity: Number | number = 0

  @Property({ columnType: "jsonb" })
  raw_damaged_quantity: BigNumberRawValue

  @ManyToOne(() => Return, {
    columnType: "text",
    fieldName: "return_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ReturnIdIndex.MikroORMIndex()
  return_id: string

  @ManyToOne(() => Return, {
    persist: false,
  })
  return: Return

  @ManyToOne({
    entity: () => OrderLineItem,
    fieldName: "item_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @ManyToOne(() => OrderLineItem, {
    persist: false,
  })
  item: OrderLineItem

  @Property({ columnType: "text", nullable: true })
  note: string

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
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "retitem")
    this.return_id ??= this.return?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "retitem")
    this.return_id ??= this.return?.id
  }
}
