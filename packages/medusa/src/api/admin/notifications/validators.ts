import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetNotificationParamsType = z.infer<
  typeof AdminGetNotificationParams
>
export const AdminGetNotificationParams = createSelectParams()

export const AdminGetNotificationsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  channel: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetNotificationsParamsType = z.infer<
  typeof AdminGetNotificationsParams
>
export const AdminGetNotificationsParams = createFindParams({
  limit: 50,
  offset: 0,
  order: "-created_at",
})
  .merge(AdminGetNotificationsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetNotificationsParamsFields))
