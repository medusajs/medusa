import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { PriceListStatus, PriceListType } from "@medusajs/utils"
import PriceListRule from "./price-list-rule"
import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"

type OptionalFields =
  | "status"
  | "type"
  | "rules_count"
  | "starts_at"
  | "ends_at"
  | "created_at"
  | "updated_at"
  | "deleted_at"

type OptionalRelations =
  | "price_set_money_amounts"
  | "rule_types"
  | "price_list_rules"

@Entity()
export default class PriceList {
  [OptionalProps]: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  description: string

  @Enum({ items: () => PriceListStatus, default: PriceListStatus.DRAFT })
  status?: PriceListStatus

  @Enum({ items: () => PriceListType, default: PriceListType.SALE })
  type?: PriceListType

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  starts_at?: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  ends_at?: Date | null

  @OneToMany(() => PriceSetMoneyAmount, (psma) => psma.price_list, {
    cascade: [Cascade.REMOVE],
  })
  price_set_money_amounts = new Collection<PriceSetMoneyAmount>(this)

  @OneToMany(() => PriceListRule, (pr) => pr.price_list, {
    cascade: [Cascade.REMOVE],
  })
  price_list_rules = new Collection<PriceListRule>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceListRule,
    cascade: [Cascade.REMOVE],
  })
  rule_types = new Collection<RuleType>(this)

  @Property({ columnType: "integer", default: 0 })
  rules_count?: number

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @Index({ name: "IDX_price_list_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "plist")
  }
}
