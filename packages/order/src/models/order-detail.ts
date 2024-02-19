import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  BigNumberField,
  createPsqlIndexStatementHelper,
  generateEntityId,
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

const IdIndex = createPsqlIndexStatementHelper({
  tableName: "order_detail",
  columns: "id",
})

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
  @IdIndex.MikroORMIndex()
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

  @Property({ columnType: "numeric" })
  @BigNumberField()
  quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  fulfilled_quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_fulfilled_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  shipped_quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_shipped_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  return_requested_quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_return_requested_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  return_received_quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_return_received_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  return_dismissed_quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_return_dismissed_quantity: BigNumberRawValue

  @Property({ columnType: "numeric" })
  @BigNumberField()
  written_off_quantity: BigNumber | number

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
