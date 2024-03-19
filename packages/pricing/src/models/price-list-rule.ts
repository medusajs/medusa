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
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceList from "./price-list"
import PriceListRuleValue from "./price-list-rule-value"
import RuleType from "./rule-type"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "price_list_rule"
const PriceListRuleDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceListRuleRuleTypeIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "rule_type_id",
  where: "deleted_at IS NOT NULL",
  unique: true,
})

const PriceListRulePriceListIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "price_list_id",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceListRule {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @PriceListRuleRuleTypeIdIndex.MikroORMIndex()
  @ManyToOne({ entity: () => RuleType, fieldName: "rule_type_id" })
  rule_type: RuleType

  @OneToMany(() => PriceListRuleValue, (plrv) => plrv.price_list_rule, {
    cascade: ["soft-remove" as Cascade],
  })
  price_list_rule_values = new Collection<PriceListRuleValue>(this)

  @PriceListRulePriceListIdIndex.MikroORMIndex()
  @ManyToOne({
    entity: () => PriceList,
    fieldName: "price_list_id",
    onDelete: "cascade",
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

  @PriceListRuleDeletedAtIndex.MikroORMIndex()
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
