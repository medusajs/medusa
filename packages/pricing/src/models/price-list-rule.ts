import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import PriceList from "./price-list"
import PriceListRuleValue from "./price-list-rule-value"
import RuleType from "./rule-type"

type OptionalFields = "id"
type OptionalRelations = "rule_type" | "price_list"

@Entity()
@Unique({
  name: "IDX_price_list_rule_rule_type_id_price_list_id_unique",
  properties: ["price_list", "rule_type"],
})
export default class PriceListRule {
  [OptionalProps]: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne({
    entity: () => RuleType,
    fieldName: "rule_type_id",
    name: "price_rule_rule_type_id_unique",
    index: "IDX_price_list_rule_rule_type_id",
  })
  rule_type: RuleType

  @OneToMany(() => PriceListRuleValue, (plrv) => plrv.price_list_rule, {
    cascade: [Cascade.REMOVE],
  })
  price_list_rule_values = new Collection<PriceListRuleValue>(this)

  @ManyToOne({
    entity: () => PriceList,
    fieldName: "price_list_id",
    name: "price_rule_price_list_id",
    index: "IDX_price_list_rule_price_list_id",
  })
  price_list: PriceList

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "plrule")
  }
}
