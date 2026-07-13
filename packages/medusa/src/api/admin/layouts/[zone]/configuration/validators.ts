import { z } from "@medusajs/framework/zod"

const LayoutWidgetPreference = z.object({
  hidden: z.boolean().optional(),
  section: z.string().optional(),
  order: z.number().optional(),
})

export type AdminSetLayoutConfigurationType = z.infer<
  typeof AdminSetLayoutConfiguration
>
export const AdminSetLayoutConfiguration = z.object({
  is_default: z.boolean().optional().default(false),
  configuration: z.object({
    widgets: z.record(z.string(), LayoutWidgetPreference),
  }),
})
