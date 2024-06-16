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
  Rel,
} from "@mikro-orm/core"
import Claim from "./claim"
import Exchange from "./exchange"
import Order from "./order"
import Return from "./return"

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
  })
  claim: Rel<Claim>

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
