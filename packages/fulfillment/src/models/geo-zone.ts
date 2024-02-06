import { DALUtils, generateEntityId, GeoZoneType } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

type GeoZoneOptionalProps = DAL.EntityDateColumns

// TODO: Preliminary index creation, need some thoughts once we start filtering by these fields etc. Same for all entities in that dir

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class GeoZone {
  [OptionalProps]?: GeoZoneOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Enum({ items: () => GeoZoneType, default: GeoZoneType.COUNTRY })
  type: GeoZoneType

  @Index({
    name: "IDX_geo_zone_country_code",
    expression:
      'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_country_code" ON "geo_zone" ("country_code") WHERE deleted_at IS NULL',
  })
  @Property({ columnType: "text" })
  country_code: string

  @Index({
    name: "IDX_geo_zone_province_code",
    expression:
      'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_province_code" ON "geo_zone" ("province_code") WHERE deleted_at IS NULL AND province_code IS NOT NULL',
  })
  @Property({ columnType: "text", nullable: true })
  province_code: string | null = null

  @Index({
    name: "IDX_geo_zone_city",
    expression:
      'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_city" ON "geo_zone" ("city") WHERE deleted_at IS NULL AND city IS NOT NULL',
  })
  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  // TODO: Do we have an example or idea of what would be stored in this field?
  @Property({ columnType: "jsonb", nullable: true })
  postal_expression: Record<string, unknown> | null = null

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

  @Index({ name: "IDX_geo_zone_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, " geozo")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "geozo")
  }
}
