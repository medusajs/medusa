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
import Order from "./order"

type OptionalLineItemProps = DAL.EntityDateColumns

const ReferenceIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "reference_id",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "order_id",
})

const CurrencyCodeIndex = createPsqlIndexStatementHelper({
  tableName: "order_transaction",
  columns: "currency_code",
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
