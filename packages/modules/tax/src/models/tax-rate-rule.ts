import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Filter,
  OptionalProps,
  BeforeCreate,
  OnInit,
} from "@mikro-orm/core"
import TaxRate from "./tax-rate"

const TABLE_NAME = "tax_rate_rule"

type OptionalRuleProps = DAL.SoftDeletableEntityDateColumns

const taxRateIdIndexName = "IDX_tax_rate_rule_tax_rate_id"
const taxRateIdIndexStatement = createPsqlIndexStatementHelper({
  name: taxRateIdIndexName,
  tableName: TABLE_NAME,
  columns: "tax_rate_id",
  where: "deleted_at IS NULL",
})

const referenceIdIndexName = "IDX_tax_rate_rule_reference_id"
const referenceIdIndexStatement = createPsqlIndexStatementHelper({
  name: referenceIdIndexName,
  tableName: TABLE_NAME,
  columns: "reference_id",
  where: "deleted_at IS NULL",
})

export const uniqueRateReferenceIndexName =
  "IDX_tax_rate_rule_unique_rate_reference"
const uniqueRateReferenceIndexStatement = createPsqlIndexStatementHelper({
  name: uniqueRateReferenceIndexName,
  tableName: TABLE_NAME,
  columns: ["tax_rate_id", "reference_id"],
  unique: true,
  where: "deleted_at IS NULL",
})

@Entity({ tableName: TABLE_NAME })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
@uniqueRateReferenceIndexStatement.MikroORMIndex()
export default class TaxRateRule {
  [OptionalProps]?: OptionalRuleProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => TaxRate, {
    type: "text",
    fieldName: "tax_rate_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @taxRateIdIndexStatement.MikroORMIndex()
  tax_rate_id: string

  @Property({ columnType: "text" })
  @referenceIdIndexStatement.MikroORMIndex()
  reference_id: string

  @Property({ columnType: "text" })
  reference: string

  @ManyToOne(() => TaxRate, { persist: false })
  tax_rate: TaxRate

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null

  @createPsqlIndexStatementHelper({
    tableName: TABLE_NAME,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "txrule")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txrule")
  }
}
