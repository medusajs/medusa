import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
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

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetMoneyAmount {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  title: string | null = null

  @ManyToOne(() => PriceSet, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_price_set_id",
  })
  price_set: PriceSet

  @OneToOne(() => MoneyAmount, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_money_amount_id",
  })
  money_amount: MoneyAmount

  @Property({ columnType: "integer", default: 0 })
  rules_count: number = 0

  @OneToMany({
    entity: () => PriceRule,
    mappedBy: (pr) => pr.price_set_money_amount,
    cascade: [Cascade.REMOVE, "soft-remove" as Cascade],
  })
  price_rules = new Collection<PriceRule>(this)

  @OneToMany({
    entity: () => PriceSetMoneyAmountRules,
    mappedBy: (psmar) => psmar.price_set_money_amount,
  })
  price_set_money_amount_rules = new Collection<PriceSetMoneyAmountRules>(this)

  @ManyToOne(() => PriceList, {
    index: "IDX_price_rule_price_list_id",
    onDelete: "cascade",
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
