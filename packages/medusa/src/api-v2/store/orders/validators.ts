import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

export const StoreGetOrder = createSelectParams()
export type StoreGetOrderType = z.infer<typeof StoreGetOrder>
