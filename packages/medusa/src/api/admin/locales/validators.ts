import { z } from "@medusajs/framework/zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const AdminGetLocaleParams = createSelectParams()

export const AdminGetLocalesParamsFields = z.object({
  q: z.string().optional(),
  code: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetLocalesParamsType = z.infer<typeof AdminGetLocalesParams>
export const AdminGetLocalesParams = createFindParams({
  offset: 0,
  limit: 200,
})
  .merge(AdminGetLocalesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetLocalesParamsFields))
