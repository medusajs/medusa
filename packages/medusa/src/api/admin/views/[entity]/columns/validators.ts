import { z } from "@zjedene-medusa/framework/zod"
import { createSelectParams } from "../../../../utils/validators"

export type AdminGetColumnsParamsType = z.infer<typeof AdminGetColumnsParams>
export const AdminGetColumnsParams = createSelectParams()
