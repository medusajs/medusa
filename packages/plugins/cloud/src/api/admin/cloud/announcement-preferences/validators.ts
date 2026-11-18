import { z } from "@medusajs/framework/zod"

export type AdminUpdateCloudAnnouncementPreferencesType = z.infer<
  typeof AdminUpdateCloudAnnouncementPreferences
>
export const AdminUpdateCloudAnnouncementPreferences = z
  .object({
    security: z.boolean().optional(),
    feature: z.boolean().optional(),
    cloud: z.boolean().optional(),
  })
  .strict()
