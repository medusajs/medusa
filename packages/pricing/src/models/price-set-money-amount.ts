import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DALUtils, generateEntityId } from "@medusajs/utils"

import MoneyAmount from "./money-amount"
import PriceList from "./price-list"
import PriceRule from "./price-rule"
import PriceSet from "./price-set"
import PriceSetMoneyAmountRules from "./price-set-money-amount-rules"

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetMoneyAmount {
  [OptionalProps]?: "created_at" | "updated_at" | "deleted_at"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title!: string

  @ManyToOne(() => PriceSet, {
    deleteRule: "cascade",
    index: "IDX_price_set_money_amount_price_set_id",
  })
  price_set: PriceSet

  @OneToOne(() => MoneyAmount, {
    deleteRule: "cascade",
    index: "IDX_price_set_money_amount_money_amount_id",
  })
  money_amount: MoneyAmount

  @Property({ columnType: "integer", default: 0 })
  rules_count: number

  @OneToMany({
    entity: () => PriceRule,
    mappedBy: (pr) => pr.price_set_money_amount,
    cascade: ["soft-remove"] as any,
  })
  price_rules = new Collection<PriceRule>(this)

  @OneToMany({
    entity: () => PriceSetMoneyAmountRules,
    mappedBy: (psmar) => psmar.price_set_money_amount,
  })
  price_set_money_amount_rules = new Collection<PriceSetMoneyAmountRules>(this)

  @ManyToOne(() => PriceList, {
    index: "IDX_price_rule_price_list_id",
    deleteRule: "cascade",
    cascade: [Cascade.REMOVE, "soft-remove"] as any,
    nullable: true,
  })
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

  @Property({
    columnType: "timestamptz",
    nullable: true,
    index: "IDX_price_set_money_amount_deleted_at",
  })
  deleted_at: Date | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psma")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "psma")
  }

  constructor(money_amount: MoneyAmount, price_set: PriceSet) {
    this.money_amount = money_amount
    this.price_set = price_set
  }
}
