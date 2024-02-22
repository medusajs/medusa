import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ItemSummary } from "../types/common"
import LineItem from "./line-item"
import Order from "./order"

type OptionalLineItemProps = DAL.EntityDateColumns

const OrderItemVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_detail",
  columns: ["order_id", "item_id", "version"],
  unique: true,
})

@Entity({ tableName: "order_detail" })
@OrderItemVersionIndex.MikroORMIndex()
export default class OrderDetail {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  order_id: string

  @Property({ columnType: "integer" })
  version: number
  @ManyToOne({
    entity: () => Order,
    onDelete: "cascade",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  order: Order

  @Property({ columnType: "text" })
  item_id: string

  @ManyToOne({
    entity: () => LineItem,
    onDelete: "cascade",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  item: LineItem

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  quantity: number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  fulfilled_quantity: number

  @Property({ columnType: "jsonb" })
  raw_fulfilled_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  shipped_quantity: number

  @Property({ columnType: "jsonb" })
  raw_shipped_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  return_requested_quantity: number

  @Property({ columnType: "jsonb" })
  raw_return_requested_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  return_received_quantity: number

  @Property({ columnType: "jsonb" })
  raw_return_received_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  return_dismissed_quantity: number

  @Property({ columnType: "jsonb" })
  raw_return_dismissed_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  written_off_quantity: number

  @Property({ columnType: "jsonb" })
  raw_written_off_quantity: BigNumberRawValue

  @Property({ columnType: "jsonb" })
  summary: ItemSummary | null = {} as ItemSummary

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
    this.id = generateEntityId(this.id, "ordlisum")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordlisum")
  }
}
