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
import LineItem from "./line-item"
import Order from "./order"

type OptionalLineItemProps = DAL.EntityDateColumns

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_detail",
  columns: ["order_id"],
})

const OrderVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_detail",
  columns: ["version"],
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_detail",
  columns: ["item_id"],
})

@Entity({ tableName: "order_detail" })
export default class OrderDetail {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @Property({ columnType: "integer" })
  @OrderVersionIndex.MikroORMIndex()
  version: number

  @ManyToOne({
    entity: () => Order,
    persist: false,
  })
  order: Order

  @Property({ columnType: "text" })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @ManyToOne({
    entity: () => LineItem,
    persist: false,
  })
  item: LineItem

  @MikroOrmBigNumberProperty()
  quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  fulfilled_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_fulfilled_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  shipped_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_shipped_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  return_requested_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_return_requested_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  return_received_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_return_received_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  return_dismissed_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_return_dismissed_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  written_off_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_written_off_quantity: BigNumberRawValue

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "orddetail")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "orddetail")
  }
}
