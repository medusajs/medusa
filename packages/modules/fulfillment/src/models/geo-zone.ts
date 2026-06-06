import {
  BelongsTo,
  DmlEntity,
  DMLEntitySchemaBuilder,
  GeoZoneType,
  IdProperty,
  JSONProperty,
  model,
  NullableModifier,
  PrimaryKeyModifier,
  TextProperty,
} from "@zjedene-medusa/framework/utils"

import { ServiceZone } from "./service-zone"

export type GeoZoneSchema = {
  id: PrimaryKeyModifier<string, IdProperty>
  type: TextProperty
  country_code: TextProperty
  province_code?: NullableModifier<string, TextProperty>
  city?: NullableModifier<string, TextProperty>
  postal_expression?: NullableModifier<Record<string, unknown>, JSONProperty>
  service_zone: BelongsTo<() => typeof ServiceZone>
  metadata?: NullableModifier<Record<string, unknown>, JSONProperty>
}

export const GeoZone = model
  .define("geo_zone", {
    id: model.id({ prefix: "fgz" }).primaryKey(),
    type: model.enum(GeoZoneType).default(GeoZoneType.COUNTRY),
    country_code: model.text(),
    province_code: model.text().nullable(),
    city: model.text().nullable(),
    postal_expression: model.json().nullable(),
    service_zone: model.belongsTo<() => typeof ServiceZone>(() => ServiceZone, {
      mappedBy: "geo_zones",
    }),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["country_code"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["province_code"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["city"],
      where: "deleted_at IS NULL",
    },
  ]) as unknown as DmlEntity<DMLEntitySchemaBuilder<GeoZoneSchema>, "GeoZone">
