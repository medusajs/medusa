import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import Fulfillment from "./fulfillment"

type FulfillmentItemOptionalProps = DAL.SoftDeletableEntityDateColumns

const fulfillmentIdIndexName = "IDX_fulfillment_item_fulfillment_id"
const fulfillmentIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentIdIndexName,
  tableName: "fulfillment_item",
  columns: "fulfillment_id",
  where: "deleted_at IS NULL",
})

const lineItemIndexName = "IDX_fulfillment_item_line_item_id"
const lineItemIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentIdIndexName,
  tableName: "fulfillment_item",
  columns: "line_item_id",
  where: "deleted_at IS NULL",
})

const inventoryItemIndexName = "IDX_fulfillment_item_inventory_item_id"
const inventoryItemIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentIdIndexName,
  tableName: "fulfillment_item",
  columns: "inventory_item_id",
  where: "deleted_at IS NULL",
})

const fulfillmentItemDeletedAtIndexName = "IDX_fulfillment_item_deleted_at"
const fulfillmentItemDeletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentItemDeletedAtIndexName,
  tableName: "fulfillment_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentItem {
  [OptionalProps]?: FulfillmentItemOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  sku: string

  @Property({ columnType: "text" })
  barcode: string

  @Property({ columnType: "numeric", serializer: Number })
  quantity: number // TODO: probably allow big numbers here

  @Property({ columnType: "text", nullable: true })
  @Index({
    name: lineItemIndexName,
    expression: lineItemIdIndexStatement,
  })
  line_item_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  @Index({
    name: inventoryItemIndexName,
    expression: inventoryItemIdIndexStatement,
  })
  inventory_item_id: string | null = null

  @Property({ columnType: "text" })
  @Index({
    name: fulfillmentIdIndexName,
    expression: fulfillmentIdIndexStatement,
  })
  fulfillment_id: string

  @ManyToOne(() => Fulfillment)
  fulfillment: Fulfillment

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

  @Index({
    name: fulfillmentItemDeletedAtIndexName,
    expression: fulfillmentItemDeletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fulit")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fulit")
  }
}
