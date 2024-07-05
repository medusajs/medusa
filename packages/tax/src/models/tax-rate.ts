import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import TaxRateRule from "./tax-rate-rule"
import TaxRegion from "./tax-region"

type OptionalTaxRateProps = DAL.SoftDeletableEntityDateColumns

const TABLE_NAME = "tax_rate"

export const singleDefaultRegionIndexName = "IDX_single_default_region"
const singleDefaultRegionIndexStatement = createPsqlIndexStatementHelper({
  name: singleDefaultRegionIndexName,
  tableName: TABLE_NAME,
  columns: "tax_region_id",
  unique: true,
  where: "is_default = true AND deleted_at IS NULL",
})

const taxRegionIdIndexName = "IDX_tax_rate_tax_region_id"
const taxRegionIdIndexStatement = createPsqlIndexStatementHelper({
  name: taxRegionIdIndexName,
  tableName: TABLE_NAME,
  columns: "tax_region_id",
  where: "deleted_at IS NULL",
})

@singleDefaultRegionIndexStatement.MikroORMIndex()
@Entity({ tableName: TABLE_NAME })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class TaxRate {
  [OptionalProps]?: OptionalTaxRateProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "real", nullable: true })
  rate: number | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  code: string | null = null

  @Searchable()
  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "bool", default: false })
  is_default = false

  @Property({ columnType: "bool", default: false })
  is_combinable = false

  @ManyToOne(() => TaxRegion, {
    columnType: "text",
    fieldName: "tax_region_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @taxRegionIdIndexStatement.MikroORMIndex()
  tax_region_id: string

  @ManyToOne({ entity: () => TaxRegion, persist: false })
  tax_region: TaxRegion

  @OneToMany(() => TaxRateRule, (rule) => rule.tax_rate, {
    cascade: ["soft-remove" as Cascade],
  })
  rules = new Collection<TaxRateRule>(this)

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
    this.id = generateEntityId(this.id, "txr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txr")
  }
}
