import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import TaxRegion from "./tax-region"
import TaxRateRule from "./tax-rate-rule"

type OptionalTaxRateProps = DAL.EntityDateColumns

const TABLE_NAME = "tax_rate"

const taxRegionIdIndexName = "IDX_tax_rate_tax_region_id"

const singleDefaultRegionIndexName = "IDX_single_default_region"
const singleDefaultRegionIndexStatement = createPsqlIndexStatementHelper({
  name: singleDefaultRegionIndexName,
  tableName: TABLE_NAME,
  columns: "tax_region_id",
  unique: true,
  where: "is_default = true",
})

@singleDefaultRegionIndexStatement.MikroORMIndex()
@Entity({ tableName: TABLE_NAME })
export default class TaxRate {
  [OptionalProps]: OptionalTaxRateProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "real", nullable: true })
  rate: number | null = null

  @Property({ columnType: "text", nullable: true })
  code: string | null = null

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "bool", default: false })
  is_default = false

  @Property({ columnType: "bool", default: false })
  is_combinable = false

  @Property({ columnType: "text" })
  tax_region_id: string

  @ManyToOne(() => TaxRegion, {
    fieldName: "tax_region_id",
    index: taxRegionIdIndexName,
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  tax_region: TaxRegion

  @OneToMany(() => TaxRateRule, (rule) => rule.tax_rate)
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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "txr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txr")
  }
}
