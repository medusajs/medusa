import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../../../utils/validators"
import { applyAndAndOrOperators } from "../../../../utils/common-validators"

export const AdminGetViewConfigurationParams = createSelectParams()

export type AdminGetActiveViewConfigurationParamsType = z.infer<typeof AdminGetActiveViewConfigurationParams>
export const AdminGetActiveViewConfigurationParams = createSelectParams()

export const AdminGetViewConfigurationsParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  entity: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  user_id: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  is_system_default: z.boolean().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
})

export type AdminGetViewConfigurationsParamsType = z.infer<typeof AdminGetViewConfigurationsParams>
export const AdminGetViewConfigurationsParams = createFindParams({
  offset: 0,
  limit: 20,
})
  .merge(AdminGetViewConfigurationsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetViewConfigurationsParamsFields))

export type AdminCreateViewConfigurationType = z.infer<typeof AdminCreateViewConfiguration>
export const AdminCreateViewConfiguration = z.object({
  name: z.string().optional(),
  is_system_default: z.boolean().optional().default(false),
  set_active: z.boolean().optional().default(false),
  configuration: z.object({
    visible_columns: z.array(z.string()),
    column_order: z.array(z.string()),
    column_widths: z.record(z.string(), z.number()).optional(),
    filters: z.record(z.string(), z.any()).optional(),
    sorting: z.object({
      id: z.string(),
      desc: z.boolean(),
    }).nullable().optional(),
    search: z.string().optional(),
  }),
})

export type AdminUpdateViewConfigurationType = z.infer<typeof AdminUpdateViewConfiguration>
export const AdminUpdateViewConfiguration = z.object({
  name: z.string().optional(),
  is_system_default: z.boolean().optional(),
  set_active: z.boolean().optional().default(false),
  configuration: z.object({
    visible_columns: z.array(z.string()).optional(),
    column_order: z.array(z.string()).optional(),
    column_widths: z.record(z.string(), z.number()).optional(),
    filters: z.record(z.string(), z.any()).optional(),
    sorting: z.object({
      id: z.string(),
      desc: z.boolean(),
    }).nullable().optional(),
    search: z.string().optional(),
  }).optional(),
})

export type AdminSetActiveViewConfigurationType = z.infer<typeof AdminSetActiveViewConfiguration>
export const AdminSetActiveViewConfiguration = z.object({
  view_configuration_id: z.union([z.string(), z.null()]),
})