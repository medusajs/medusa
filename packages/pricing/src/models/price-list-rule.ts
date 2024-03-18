import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import PriceList from "./price-list"
import PriceListRuleValue from "./price-list-rule-value"
import RuleType from "./rule-type"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
@Unique({
  name: "IDX_price_list_rule_rule_type_id_price_list_id_unique",
  properties: ["price_list", "rule_type"],
})
export default class PriceListRule {
  [OptionalProps]: OptionalFields

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
    cascade: [Cascade.REMOVE, "soft-remove" as Cascade],
  })
  price_list_rule_values = new Collection<PriceListRuleValue>(this)

  @ManyToOne({
    entity: () => PriceList,
    fieldName: "price_list_id",
    name: "price_rule_price_list_id",
    index: "IDX_price_list_rule_price_list_id",
  })
  price_list: PriceList

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

  @Index({ name: "IDX_price_list_rule_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "plrule")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "plrule")
  }
}
