import { z } from "zod"

const geoZoneBaseSchema = z.object({
  country_code: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export const geoZoneCountrySchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("country"),
  })
)

export const geoZoneProvinceSchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("province"),
    province_code: z.string(),
  })
)

export const geoZoneCitySchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("city"),
    province_code: z.string(),
    city: z.string(),
  })
)

export const geoZoneZipSchema = geoZoneBaseSchema.merge(
  z.object({
    type: z.literal("zip"),
    province_code: z.string(),
    city: z.string(),
    postal_expression: z.record(z.unknown()),
  })
)
