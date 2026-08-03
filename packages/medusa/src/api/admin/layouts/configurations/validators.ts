import { z } from "@medusajs/framework/zod"
import { createFindParams } from "../../../utils/validators"
import { applyAndAndOrOperators } from "../../../utils/common-validators"

export const AdminGetLayoutConfigurationsParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  zone: z.union([z.string(), z.array(z.string())]).optional(),
  user_id: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  is_system_default: z.boolean().optional(),
})

export type AdminGetLayoutConfigurationsParamsType = z.infer<
  typeof AdminGetLayoutConfigurationsParams
>
export const AdminGetLayoutConfigurationsParams = createFindParams({
  offset: 0,
  limit: 20,
})
  .extend(AdminGetLayoutConfigurationsParamsFields.shape)
  .extend(
    applyAndAndOrOperators(AdminGetLayoutConfigurationsParamsFields).shape
  )
