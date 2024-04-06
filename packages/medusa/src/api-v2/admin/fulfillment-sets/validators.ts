import { z } from "zod"
import { createFindParams, createOperatorMap } from "../../utils/validators"

const geoZoneBaseSchema = z.object({
  country_code: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

const geoZoneCountrySchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("country"),
  })
)

const geoZoneProvinceSchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("province"),
    province_code: z.string(),
  })
)

const geoZoneCitySchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("city"),
    province_code: z.string(),
    city: z.string(),
  })
)

const geoZoneZipSchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("zip"),
    province_code: z.string(),
    city: z.string(),
    postal_expression: z.record(z.unknown()),
  })
)

export const AdminCreateFulfillmentSetServiceZonesSchema = z
  .object({
    name: z.string(),
    geo_zones: z.array(
      z.union([
        geoZoneCountrySchema,
        geoZoneProvinceSchema,
        geoZoneCitySchema,
        geoZoneZipSchema,
      ])
    ),
  })
  .strict()

export type AdminCreateFulfillmentSetServiceZonesSchemaType = z.infer<
  typeof AdminCreateFulfillmentSetServiceZonesSchema
>

export type AdminFulfillmentSetParamsType = z.infer<
  typeof AdminFulfillmentSetParams
>
export const AdminFulfillmentSetParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    type: z.union([z.string(), z.array(z.string())]).optional(),
    service_zone_id: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
