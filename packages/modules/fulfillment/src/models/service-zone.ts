import {
  BelongsTo,
  DmlEntity,
  DMLEntitySchemaBuilder,
  HasMany,
  IdProperty,
  JSONProperty,
  model,
  NullableModifier,
  PrimaryKeyModifier,
  TextProperty,
} from "@zjedene-medusa/framework/utils"

import { FulfillmentSet } from "./fulfillment-set"
import { GeoZone } from "./geo-zone"
import { ShippingOption } from "./shipping-option"

export type ServiceZoneSchema = {
  id: PrimaryKeyModifier<string, IdProperty>
  name: TextProperty
  fulfillment_set: BelongsTo<() => typeof FulfillmentSet>
  geo_zones: HasMany<() => typeof GeoZone>
  shipping_options: HasMany<() => typeof ShippingOption>
  metadata: NullableModifier<Record<string, unknown>, JSONProperty>
}

export const ServiceZone = model
  .define("service_zone", {
    id: model.id({ prefix: "serzo" }).primaryKey(),
    name: model.text(),
    fulfillment_set: model.belongsTo<() => typeof FulfillmentSet>(
      () => FulfillmentSet,
      {
        mappedBy: "service_zones",
      }
    ),
    geo_zones: model.hasMany<() => typeof GeoZone>(() => GeoZone, {
      mappedBy: "service_zone",
    }),
    shipping_options: model.hasMany<() => typeof ShippingOption>(
      () => ShippingOption,
      {
        mappedBy: "service_zone",
      }
    ),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
  .cascades({
    delete: ["geo_zones", "shipping_options"],
  }) as unknown as DmlEntity<
  DMLEntitySchemaBuilder<ServiceZoneSchema>,
  "ServiceZone"
>
