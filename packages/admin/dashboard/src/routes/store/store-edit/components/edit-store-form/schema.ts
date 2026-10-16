import { z } from "zod"

export const StoreLogoSchema = z.object({
  url: z.string(),
  file: z.any().optional(), // File, set when a new logo is picked
})

export const EditStoreSchema = z.object({
  name: z.string().min(1),
  logo: StoreLogoSchema.nullable(),
  default_currency_code: z.string().optional(),
  default_region_id: z.string().optional(),
  default_sales_channel_id: z.string().optional(),
  default_location_id: z.string().optional(),
})

export type EditStoreSchemaType = z.infer<typeof EditStoreSchema>
