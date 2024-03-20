import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  ManyToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSet from "./price-set"

type OptionalFields = "default_priority"

const tableName = "rule_type"
const RuleTypeDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const RuleTypeRuleAttributeIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "rule_attribute",
  where: "deleted_at IS NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class RuleType {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name: string

  @RuleTypeRuleAttributeIndex.MikroORMIndex()
  @Property({ columnType: "text" })
  rule_attribute: string

  @Property({ columnType: "integer", default: 0 })
  default_priority: number

  @ManyToMany(() => PriceSet, (priceSet) => priceSet.rule_types)
  price_sets = new Collection<PriceSet>(this)

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

  @RuleTypeDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "rul-typ")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "rul-typ")
  }
}

export default RuleType
