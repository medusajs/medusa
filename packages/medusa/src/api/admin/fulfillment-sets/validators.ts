import { z } from "zod"
import { createSelectParams } from "../../utils/validators"
import {
  geoZoneCitySchema,
  geoZoneCountrySchema,
  geoZoneProvinceSchema,
  geoZoneZipSchema,
} from "./validators/geo-zone"

export const AdminServiceZonesParams = createSelectParams()
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

export const AdminFulfillmentSetParams = createSelectParams()

export type AdminCreateFulfillmentSetServiceZonesType = z.infer<
  typeof AdminCreateFulfillmentSetServiceZonesSchema
>
export type AdminUpdateFulfillmentSetServiceZonesType = z.infer<
  typeof AdminUpdateFulfillmentSetServiceZonesSchema
>
export type AdminFulfillmentSetParamsType = z.infer<
  typeof AdminFulfillmentSetParams
>
