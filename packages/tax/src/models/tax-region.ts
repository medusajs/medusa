import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Check,
  Cascade,
} from "@mikro-orm/core"
import TaxRate from "./tax-rate"

type OptionalTaxRegionProps = DAL.EntityDateColumns

const TABLE_NAME = "tax_region"

const countryCodeProvinceIndexName = "IDX_tax_region_unique_country_province"
const countryCodeProvinceIndexStatement = createPsqlIndexStatementHelper({
  name: countryCodeProvinceIndexName,
  tableName: TABLE_NAME,
  columns: ["country_code", "province_code"],
  unique: true,
})

const taxRegionCountryTopLevelCheckName = "CK_tax_region_country_top_level"
@Check({
  name: taxRegionCountryTopLevelCheckName,
  expression: `parent_id IS NULL OR province_code IS NOT NULL`,
})
@countryCodeProvinceIndexStatement.MikroORMIndex()
@Entity({ tableName: TABLE_NAME })
export default class TaxRegion {
  [OptionalProps]: OptionalTaxRegionProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  country_code: string

  @Property({ columnType: "text", nullable: true })
  province_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  parent_id: string | null = null

  @ManyToOne(() => TaxRegion, {
    index: "IDX_tax_region_parent_id",
    cascade: [Cascade.PERSIST],
    onDelete: "set null",
    nullable: true,
  })
  parent: TaxRegion

  @OneToMany(() => TaxRate, (label) => label.tax_region)
  tax_rates = new Collection<TaxRate>(this)

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
    this.id = generateEntityId(this.id, "txreg")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txreg")
  }
}
