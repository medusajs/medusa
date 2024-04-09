import { z } from "zod"
import { createFindParams, createOperatorMap } from "../../utils/validators"
import {
  geoZoneCitySchema,
  geoZoneCountrySchema,
  geoZoneProvinceSchema,
  geoZoneZipSchema,
} from "./validators/geo-zone"

export const AdminServiceZonesParams = createFindParams()
export type AdminServiceZonesParamsType = z.infer<
  typeof AdminServiceZonesParams
>

export const AdminCreateFulfillmentSetServiceZonesSchema = z
  .object({
    name: z.string(),
    geo_zones: z
      .array(
        z.union([
          geoZoneCountrySchema,
          geoZoneProvinceSchema,
          geoZoneCitySchema,
          geoZoneZipSchema,
        ])
      )
      .optional(),
  })
  .strict()

export const AdminUpdateFulfillmentSetServiceZonesSchema = z
  .object({
    name: z.string().optional(),
    geo_zones: z
      .array(
        z.union([
          geoZoneCountrySchema.merge(z.object({ id: z.string().optional() })),
          geoZoneProvinceSchema.merge(z.object({ id: z.string().optional() })),
          geoZoneCitySchema.merge(z.object({ id: z.string().optional() })),
          geoZoneZipSchema.merge(z.object({ id: z.string().optional() })),
        ])
      )
      .optional(),
  })
  .strict()

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

export type AdminCreateFulfillmentSetServiceZonesType = z.infer<
  typeof AdminCreateFulfillmentSetServiceZonesSchema
>
export type AdminUpdateFulfillmentSetServiceZonesType = z.infer<
  typeof AdminUpdateFulfillmentSetServiceZonesSchema
>
export type AdminFulfillmentSetParamsType = z.infer<
  typeof AdminFulfillmentSetParams
>
