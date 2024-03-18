import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetMoneyAmountRules {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceSetMoneyAmount, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_rules_price_set_money_amount_id",
  })
  price_set_money_amount: PriceSetMoneyAmount

  @ManyToOne(() => RuleType, {
    index: "IDX_price_set_money_amount_rules_rule_type_id",
  })
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

  @Index({ name: "IDX_price_set_money_amount_rules_deleted_at" })
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
