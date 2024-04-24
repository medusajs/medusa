import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

export type AdminFulfillmentProvidersParamsType = z.infer<
  typeof AdminFulfillmentProvidersParams
>
export const AdminFulfillmentProvidersParams = createSelectParams()
