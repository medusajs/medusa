import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSet from "./price-set"
import RuleType from "./rule-type"

const tableName = "price_set_rule_type"
const PriceSetRuleTypeDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceSetRuleTypePriceSetIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "price_set_id",
  where: "deleted_at IS NULL",
})

const PriceSetRuleTypeRuleTypeIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "rule_type_id",
  where: "deleted_at IS NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetRuleType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @PriceSetRuleTypePriceSetIdIndex.MikroORMIndex()
  @ManyToOne(() => PriceSet, {
    columnType: "text",
    mapToPk: true,
    fieldName: "price_set_id",
    onDelete: "cascade",
  })
  price_set_id: string

  @PriceSetRuleTypeRuleTypeIdIndex.MikroORMIndex()
  @ManyToOne(() => RuleType, {
    columnType: "text",
    mapToPk: true,
    fieldName: "rule_type_id",
    onDelete: "cascade",
  })
  rule_type_id: string

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

  @PriceSetRuleTypeDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psrt")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "psrt")
  }
}
