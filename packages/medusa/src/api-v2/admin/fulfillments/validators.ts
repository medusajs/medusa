import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

export const AdminFulfillmentParams = createSelectParams()

export const AdminCancelFulfillment = z.object({})
export type AdminCancelFulfillmentType = z.infer<typeof AdminCancelFulfillment>
