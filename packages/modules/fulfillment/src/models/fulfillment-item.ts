import {
  BigNumber,
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/utils"

import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Fulfillment from "./fulfillment"

type FulfillmentItemOptionalProps = DAL.SoftDeletableModelDateColumns

const FulfillmentIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_item",
  columns: "fulfillment_id",
  where: "deleted_at IS NULL",
})

const LineItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_item",
  columns: "line_item_id",
  where: "deleted_at IS NULL",
})

const InventoryItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_item",
  columns: "inventory_item_id",
  where: "deleted_at IS NULL",
})

const FulfillmentItemDeletedAtIndex = createPsqlIndexStatementHelper({
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

  @MikroOrmBigNumberProperty()
  quantity: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @Property({ columnType: "text", nullable: true })
  @LineItemIdIndex.MikroORMIndex()
  line_item_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  @InventoryItemIdIndex.MikroORMIndex()
  inventory_item_id: string | null = null

  @ManyToOne(() => Fulfillment, {
    columnType: "text",
    mapToPk: true,
    fieldName: "fulfillment_id",
    onDelete: "cascade",
  })
  @FulfillmentIdIndex.MikroORMIndex()
  fulfillment_id: string

  @ManyToOne(() => Fulfillment, { persist: false })
  fulfillment: Rel<Fulfillment>

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

  @FulfillmentItemDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fulit")
    this.fulfillment_id ??= this.fulfillment.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fulit")
    this.fulfillment_id ??= this.fulfillment.id
  }
}
