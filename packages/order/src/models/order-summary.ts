import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { Order } from "@models"
import { OrderSummary as OrderSummaryFields } from "../types/common"

const OrderIdVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_summary",
  columns: ["order_id", "version"],
})

@Entity({ tableName: "order_summary" })
@OrderIdVersionIndex.MikroORMIndex()
export default class OrderSummary {
  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    columnType: "text",
    fieldName: "order_id",
    mapToPk: true,
    cascade: [Cascade.REMOVE],
  })
  order_id: string

  @ManyToOne({
    entity: () => Order,
    fieldName: "order_id",
    cascade: [Cascade.REMOVE],
    persist: false,
  })
  order: Order

  @Property({
    columnType: "integer",
    defaultRaw: "1",
  })
  version: number = 1

  @Property({ columnType: "jsonb" })
  totals: OrderSummaryFields | null = {} as OrderSummaryFields

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
    this.id = generateEntityId(this.id, "ordsum")
    this.order_id ??= this.order?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsum")
    this.order_id ??= this.order?.id
  }
}
