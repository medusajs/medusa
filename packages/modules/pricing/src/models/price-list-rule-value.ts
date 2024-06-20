import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import PriceListRule from "./price-list-rule"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "price_list_rule_value"
const PriceListRuleValueDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceListPriceListRuleIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "price_list_rule_id",
  where: "deleted_at IS NULL",
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceListRuleValue {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @PriceListPriceListRuleIdIndex.MikroORMIndex()
  @ManyToOne(() => PriceListRule, {
    columnType: "text",
    mapToPk: true,
    fieldName: "price_list_rule_id",
    onDelete: "cascade",
  })
  price_list_rule_id: string

  @ManyToOne(() => PriceListRule, { persist: false })
  price_list_rule: Rel<PriceListRule>

  @Property({ columnType: "text" })
  value: string

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

  @PriceListRuleValueDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "plrv")
    this.price_list_rule_id ??= this.price_list_rule?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "plrv")
    this.price_list_rule_id ??= this.price_list_rule?.id
  }
}
