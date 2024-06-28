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
import Price from "./price"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

const tableName = "price_rule"
const PriceRuleDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const PriceRulePriceIdIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: ["price_id", "rule_type_id"],
  where: "deleted_at IS NULL",
  unique: true,
})

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceRule {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  attribute: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "integer", default: 0 })
  priority: number = 0

  @PriceRulePriceIdIndex.MikroORMIndex()
  @ManyToOne(() => Price, {
    columnType: "text",
    mapToPk: true,
    fieldName: "price_id",
    onDelete: "cascade",
  })
  price_id: string

  @ManyToOne(() => Price, { persist: false })
  price: Rel<Price>

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

  @PriceRuleDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "prule")
    this.price_id ??= this.price?.id!
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "prule")
    this.price_id ??= this.price?.id!
  }
}
