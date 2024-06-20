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
import Exchange from "./exchange"
import LineItem from "./line-item"

type OptionalLineItemProps = DAL.EntityDateColumns

const ExchangeIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange_item",
  columns: "exchange_id",
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_exchange_item",
  columns: "item_id",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item_image",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_exchange_item" })
export default class OrderExchangeItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @MikroOrmBigNumberProperty()
  quantity: Number | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @ManyToOne(() => Exchange, {
    columnType: "text",
    fieldName: "exchange_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ExchangeIdIndex.MikroORMIndex()
  exchange_id: string

  @ManyToOne(() => Exchange, {
    persist: false,
  })
  exchange: Exchange

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
    this.id = generateEntityId(this.id, "oexcitem")
    this.exchange_id = this.exchange?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "oexcitem")
    this.exchange_id = this.exchange?.id
  }
}
