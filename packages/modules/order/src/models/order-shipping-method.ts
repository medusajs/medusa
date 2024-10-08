import { DAL } from "@medusajs/framework/types"
import {
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
  Rel,
} from "@mikro-orm/core"
import Claim from "./claim"
import Exchange from "./exchange"
import Order from "./order"
import Return from "./return"
import OrderShippingMethod from "./shipping-method"

type OptionalShippingMethodProps = DAL.ModelDateColumns

const tableName = "order_shipping"
const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ExchangeIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: ["exchange_id"],
  where: "exchange_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: ["claim_id"],
  where: "claim_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const OrderVersionIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: ["version"],
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: ["shipping_method_id"],
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
export default class OrderShipping {
  [OptionalProps]?: OptionalShippingMethodProps

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
  order: Rel<Order>

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
    nullable: true,
  })
  return: Rel<Return>

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
    nullable: true,
  })
  exchange: Rel<Exchange>

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
    nullable: true,
  })
  claim: Rel<Claim>

  @Property({ columnType: "integer" })
  @OrderVersionIndex.MikroORMIndex()
  version: number

  @ManyToOne({
    entity: () => OrderShippingMethod,
    fieldName: "shipping_method_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  shipping_method_id: string

  @ManyToOne(() => OrderShippingMethod, {
    persist: false,
  })
  shipping_method: Rel<OrderShippingMethod>

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
    this.id = generateEntityId(this.id, "ordspmv")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.claim_id ??= this.claim?.id
    this.exchange_id ??= this.exchange?.id
    this.shipping_method_id ??= this.shipping_method?.id
    this.version ??= this.order?.version
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordspmv")
    this.order_id ??= this.order?.id
    this.return_id ??= this.return?.id
    this.claim_id ??= this.claim?.id
    this.exchange_id ??= this.exchange?.id
    this.shipping_method_id ??= this.shipping_method?.id
    this.version ??= this.order?.version
  }
}
