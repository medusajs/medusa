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
import { Return } from "@models"
import Order from "./order"

type OptionalLineItemProps = DAL.EntityDateColumns

const ReferenceIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "reference_id",
  where: "deleted_at IS NOT NULL",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "order_id",
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

const CurrencyCodeIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "currency_code",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const OrderIdVersionIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: ["order_id", "version"],
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_transaction" })
@OrderIdVersionIndex.MikroORMIndex()
export default class Transaction {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    columnType: "text",
    fieldName: "order_id",
    onDelete: "cascade",
    mapToPk: true,
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

  @Property({
    columnType: "integer",
    defaultRaw: "1",
  })
  version: number = 1

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "text" })
  @CurrencyCodeIndex.MikroORMIndex()
  currency_code: string

  @Property({
    columnType: "text",
    nullable: true,
  })
  reference: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  @ReferenceIdIndex.MikroORMIndex()
  reference_id: string | null = null

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
    this.id = generateEntityId(this.id, "ordtrx")
    this.order_id ??= this.order?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordtrx")
    this.order_id ??= this.order?.id
  }
}
