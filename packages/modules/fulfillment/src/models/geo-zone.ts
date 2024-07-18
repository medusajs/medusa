import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  GeoZoneType,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import ServiceZone from "./service-zone"

type GeoZoneOptionalProps = DAL.SoftDeletableModelDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "geo_zone",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const CountryCodeIndex = createPsqlIndexStatementHelper({
  tableName: "geo_zone",
  columns: "country_code",
  where: "deleted_at IS NULL",
})

const ProvinceCodeIndex = createPsqlIndexStatementHelper({
  tableName: "geo_zone",
  columns: "province_code",
  where: "deleted_at IS NULL AND province_code IS NOT NULL",
})

const CityIndex = createPsqlIndexStatementHelper({
  tableName: "geo_zone",
  columns: "city",
  where: "deleted_at IS NULL AND city IS NOT NULL",
})

const ServiceZoneIdIndex = createPsqlIndexStatementHelper({
  tableName: "geo_zone",
  columns: "service_zone_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class GeoZone {
  [OptionalProps]?: GeoZoneOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Enum({ items: () => GeoZoneType, default: GeoZoneType.COUNTRY })
  type: GeoZoneType

  @CountryCodeIndex.MikroORMIndex()
  @Property({ columnType: "text" })
  country_code: string

  @ProvinceCodeIndex.MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  province_code: string | null = null

  @CityIndex.MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  @ManyToOne(() => ServiceZone, {
    type: "text",
    mapToPk: true,
    fieldName: "service_zone_id",
    onDelete: "cascade",
  })
  @ServiceZoneIdIndex.MikroORMIndex()
  service_zone_id: string

  @Property({ columnType: "jsonb", nullable: true })
  postal_expression: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToOne(() => ServiceZone, {
    persist: false,
  })
  service_zone: Rel<ServiceZone>

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

  @DeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fgz")
    this.service_zone_id ??= this.service_zone?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fgz")
    this.service_zone_id ??= this.service_zone?.id
  }
}
