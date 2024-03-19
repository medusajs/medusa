import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { PriceSetMoneyAmount } from "./index"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "money_amount"
const MoneyAmountDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const MoneyAmountCurrencyCodeIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "currency_code",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class MoneyAmount {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @MoneyAmountCurrencyCodeIndex.MikroORMIndex()
  @Property({ columnType: "text" })
  currency_code: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({ columnType: "numeric", nullable: true })
  min_quantity: number | null

  @Property({ columnType: "numeric", nullable: true })
  max_quantity: number | null

  @OneToOne({
    entity: () => PriceSetMoneyAmount,
    mappedBy: (psma) => psma.money_amount,
    onDelete: "cascade",
  })
  price_set_money_amount: PriceSetMoneyAmount

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

  @MoneyAmountDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ma")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ma")
  }
}

export default MoneyAmount
