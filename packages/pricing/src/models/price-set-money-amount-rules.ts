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
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "price_set_money_amount_rules"
const PriceSetMoneyAmountRulesDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceSetMoneyAmountRulesPriceSetMoneyAmountIdIndex =
  createPsqlIndexStatementHelper({
    tableName: tableName,
    columns: "price_set_money_amount_id",
    where: "deleted_at IS NOT NULL",
  })

const PriceSetMoneyAmountRulesRuleTypeIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "rule_type_id",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetMoneyAmountRules {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @PriceSetMoneyAmountRulesPriceSetMoneyAmountIdIndex.MikroORMIndex()
  @ManyToOne(() => PriceSetMoneyAmount, { onDelete: "cascade" })
  price_set_money_amount: PriceSetMoneyAmount

  @PriceSetMoneyAmountRulesRuleTypeIdIndex.MikroORMIndex()
  @ManyToOne(() => RuleType, { onDelete: "cascade" })
  rule_type: RuleType

  @Property({ columnType: "text" })
  value: string

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

  @PriceSetMoneyAmountRulesDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psmar")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "psmar")
  }
}
