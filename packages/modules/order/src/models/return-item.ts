import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
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
import LineItem from "./line-item"
import Return from "./return"
import ReturnReason from "./return-reason"

type OptionalLineItemProps = DAL.ModelDateColumns

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "return_item",
  columns: "return_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnReasonIdIndex = createPsqlIndexStatementHelper({
  tableName: "return_item",
  columns: "reason_id",
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "return_item",
  columns: "item_id",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item_image",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "return_item" })
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
    entity: () => LineItem,
    fieldName: "item_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @ManyToOne(() => LineItem, {
    persist: false,
  })
  item: LineItem

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
    this.return_id = this.return?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "retitem")
    this.return_id = this.return?.id
  }
}
