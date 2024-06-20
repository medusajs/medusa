import { DAL } from "@medusajs/types"
import { DALUtils, Searchable, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Country from "./country"

type RegionOptionalProps = "countries" | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "region" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Region {
  [OptionalProps]?: RegionOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Searchable()
  @Property({ columnType: "text" })
  name: string

  @Searchable()
  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "boolean" })
  automatic_taxes: boolean = true

  @OneToMany(() => Country, (country) => country.region)
  countries = new Collection<Country>(this)

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

  @Index({ name: "IDX_region_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "reg")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "reg")
  }
}
