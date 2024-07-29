import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type AdminGetNotificationParamsType = z.infer<
  typeof AdminGetNotificationParams
>
export const AdminGetNotificationParams = createSelectParams()

export type AdminGetNotificationsParamsType = z.infer<
  typeof AdminGetNotificationsParams
>
export const AdminGetNotificationsParams = createFindParams({
  limit: 50,
  offset: 0,
  order: "-created_at",
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    channel: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetNotificationsParams.array()).optional(),
    $or: z.lazy(() => AdminGetNotificationsParams.array()).optional(),
  })
)
