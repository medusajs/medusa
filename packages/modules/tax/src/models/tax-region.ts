import { DAL } from "@medusajs/types"
import {
  DALUtils,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Check,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import TaxProvider from "./tax-provider"
import TaxRate from "./tax-rate"

type OptionalTaxRegionProps = DAL.SoftDeletableEntityDateColumns

const TABLE_NAME = "tax_region"

export const countryCodeProvinceIndexName =
  "IDX_tax_region_unique_country_province"
const countryCodeProvinceIndexStatement = createPsqlIndexStatementHelper({
  name: countryCodeProvinceIndexName,
  tableName: TABLE_NAME,
  columns: ["country_code", "province_code"],
  unique: true,
})

export const taxRegionProviderTopLevelCheckName =
  "CK_tax_region_provider_top_level"
export const taxRegionCountryTopLevelCheckName =
  "CK_tax_region_country_top_level"

@Check({
  name: taxRegionProviderTopLevelCheckName,
  expression: `parent_id IS NULL OR provider_id IS NULL`,
})
@Check({
  name: taxRegionCountryTopLevelCheckName,
  expression: `parent_id IS NULL OR province_code IS NOT NULL`,
})
@countryCodeProvinceIndexStatement.MikroORMIndex()
@Entity({ tableName: TABLE_NAME })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class TaxRegion {
  [OptionalProps]?: OptionalTaxRegionProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => TaxProvider, {
    fieldName: "provider_id",
    mapToPk: true,
    nullable: true,
  })
  provider_id: string | null = null

  @ManyToOne(() => TaxProvider, { persist: false })
  provider: Rel<TaxProvider>

  @Searchable()
  @Property({ columnType: "text" })
  country_code: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  province_code: string | null = null

  @ManyToOne(() => TaxRegion, {
    index: "IDX_tax_region_parent_id",
    fieldName: "parent_id",
    onDelete: "cascade",
    mapToPk: true,
    nullable: true,
  })
  parent_id: string | null = null

  @ManyToOne(() => TaxRegion, { persist: false })
  parent: Rel<TaxRegion>

  @OneToMany(() => TaxRate, (label) => label.tax_region, {
    cascade: ["soft-remove" as Cascade],
  })
  tax_rates = new Collection<TaxRate>(this)

  @OneToMany(() => TaxRegion, (label) => label.parent, {
    cascade: ["soft-remove" as Cascade],
  })
  children = new Collection<Rel<TaxRegion>>(this)

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
    this.id = generateEntityId(this.id, "txreg")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "txreg")
  }
}
