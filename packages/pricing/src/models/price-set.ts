import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceRule from "./price-rule"
import PriceSetMoneyAmount from "./price-set-money-amount"
import PriceSetRuleType from "./price-set-rule-type"
import RuleType from "./rule-type"

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSet {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @OneToMany(() => PriceSetMoneyAmount, (psma) => psma.price_set, {
    cascade: [Cascade.REMOVE],
  })
  price_set_money_amounts = new Collection<PriceSetMoneyAmount>(this)

  @OneToMany(() => PriceRule, (pr) => pr.price_set, {
    cascade: [Cascade.REMOVE],
  })
  price_rules = new Collection<PriceRule>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceSetRuleType,
    cascade: [Cascade.REMOVE],
  })
  rule_types = new Collection<RuleType>(this)

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

  @Index({ name: "IDX_price_set_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pset")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pset")
  }
}
