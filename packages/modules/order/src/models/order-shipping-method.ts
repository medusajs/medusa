import { DAL } from "@medusajs/types"
import {
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
import Order from "./order"
import ShippingMethod from "./shipping-method"

type OptionalShippingMethodProps = DAL.EntityDateColumns

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping",
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const OrderVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping",
  columns: ["version"],
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping",
  columns: ["shipping_method_id"],
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_shipping" })
export default class OrderShippingMethod {
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

  @Property({ columnType: "integer" })
  @OrderVersionIndex.MikroORMIndex()
  version: number

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Order

  @ManyToOne({
    entity: () => ShippingMethod,
    fieldName: "shipping_method_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, {
    persist: false,
  })
  shipping_method: ShippingMethod

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
    this.shipping_method_id ??= this.shipping_method?.id
    this.version ??= this.order?.version
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordspmv")
    this.order_id ??= this.order?.id
    this.shipping_method_id ??= this.shipping_method?.id
    this.version ??= this.order?.version
  }
}
