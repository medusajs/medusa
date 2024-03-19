import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import MoneyAmount from "./money-amount"
import PriceList from "./price-list"
import PriceRule from "./price-rule"
import PriceSet from "./price-set"
import PriceSetMoneyAmountRules from "./price-set-money-amount-rules"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "price_set_money_amount"
const PriceSetMoneyAmountDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceSetMoneyAmountPriceSetIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "price_set_id",
  where: "deleted_at IS NOT NULL",
})

const PriceSetMoneyAmountMoneyAmountIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "money_amount_id",
  where: "deleted_at IS NOT NULL",
})

const PriceSetMoneyAmountPriceListIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "price_list_id",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetMoneyAmount {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  title: string | null = null

  @PriceSetMoneyAmountPriceSetIdIndex.MikroORMIndex()
  @ManyToOne(() => PriceSet, { onDelete: "cascade" })
  price_set: PriceSet

  @PriceSetMoneyAmountMoneyAmountIdIndex.MikroORMIndex()
  @OneToOne(() => MoneyAmount, { onDelete: "cascade" })
  money_amount: MoneyAmount

  @Property({ columnType: "integer", default: 0 })
  rules_count: number = 0

  @OneToMany({
    entity: () => PriceRule,
    mappedBy: (pr) => pr.price_set_money_amount,
    cascade: ["soft-remove" as Cascade],
  })
  price_rules = new Collection<PriceRule>(this)

  @OneToMany({
    entity: () => PriceSetMoneyAmountRules,
    mappedBy: (psmar) => psmar.price_set_money_amount,
  })
  price_set_money_amount_rules = new Collection<PriceSetMoneyAmountRules>(this)

  @PriceSetMoneyAmountPriceListIdIndex.MikroORMIndex()
  @ManyToOne(() => PriceList, { onDelete: "cascade", nullable: true })
  price_list: PriceList | null

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

  @PriceSetMoneyAmountDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psma")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "psma")
  }
}
