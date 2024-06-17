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
import Claim from "./claim"
import Exchange from "./exchange"
import LineItem from "./line-item"
import Order from "./order"
import Return from "./return"

type OptionalLineItemProps = DAL.EntityDateColumns

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ExchangeIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: ["exchange_id"],
  where: "exchange_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: ["claim_id"],
  where: "claim_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const OrderVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: ["version"],
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_item",
  columns: ["item_id"],
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_item" })
export default class OrderItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    mapToPk: true,
    fieldName: "order_id",
    columnType: "text",
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Order

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

  @ManyToOne({
    entity: () => Exchange,
    mapToPk: true,
    fieldName: "exchange_id",
    columnType: "text",
    nullable: true,
  })
  @ExchangeIdIndex.MikroORMIndex()
  exchange_id: string | null

  @ManyToOne(() => Exchange, {
    persist: false,
  })
  exchange: Exchange

  @ManyToOne({
    entity: () => Claim,
    mapToPk: true,
    fieldName: "claim_id",
    columnType: "text",
    nullable: true,
  })
  @ClaimIdIndex.MikroORMIndex()
  claim_id: string | null

  @ManyToOne(() => Claim, {
    persist: false,
  })
  claim: Claim

  @Property({ columnType: "integer" })
  @OrderVersionIndex.MikroORMIndex()
  version: number

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

  @Property({ columnType: "timestamptz", nullable: true })
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "orditem")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.exchange_id ??= this.exchange?.id
    this.claim_id ??= this.claim?.id
    this.item_id ??= this.item?.id
    this.version ??= this.order?.version
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "orditem")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.exchange_id ??= this.exchange?.id
    this.claim_id ??= this.claim?.id
    this.item_id ??= this.item?.id
    this.version ??= this.order?.version
  }
}
