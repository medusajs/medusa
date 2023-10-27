import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"
import PriceListRule from "./price-list-rule"
import { PriceListStatus } from "@medusajs/types"

@Entity()
export default class PriceList {
  [OptionalProps]?: "price_set_money_amounts" | "rule_types" | "status" | "rules" | "number_rules" | "starts_at" | "ends_at"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Enum({ items: () => PriceListStatus, default: PriceListStatus.DRAFT})
  status!: PriceListStatus

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  starts_at: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  ends_at: Date | null

  @OneToMany(() => PriceSetMoneyAmount, (psma) => psma.price_list, {
    cascade: [Cascade.REMOVE],
  })
  price_set_money_amounts = new Collection<PriceSetMoneyAmount>(this)

  @OneToMany(() => PriceListRule, (pr) => pr.price_list, {
    cascade: [Cascade.REMOVE],
  })
  rules = new Collection<PriceListRule>(this)

  // @ManyToMany({
  //   entity: () => MoneyAmount,
  //   pivotEntity: () => PriceSetMoneyAmount,
  // })
  // money_amounts = new Collection<MoneyAmount>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceListRule,
    cascade: [Cascade.REMOVE],
  })
  rule_types = new Collection<RuleType>(this)

  @Property({ columnType: "integer", default: 0 })
  number_rules?: number

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pset")
  }
}
