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
      .nullish(),
  })
  .strict()

export const AdminUpdateFulfillmentSetServiceZonesSchema = z
  .object({
    name: z.string().nullish(),
    geo_zones: z
      .array(
        z.union([
          geoZoneCountrySchema.merge(z.object({ id: z.string().nullish() })),
          geoZoneProvinceSchema.merge(z.object({ id: z.string().nullish() })),
          geoZoneCitySchema.merge(z.object({ id: z.string().nullish() })),
          geoZoneZipSchema.merge(z.object({ id: z.string().nullish() })),
        ])
      )
      .nullish(),
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
