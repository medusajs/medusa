import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
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

@Entity({ tableName: "order_transaction" })
export default class Transaction {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne({
    entity: () => Order,
    fieldName: "order_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  order: Order

  @MikroOrmBigNumberProperty({
    columnType: "numeric",
  })
  amount: number

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordtrx")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordtrx")
  }
}
