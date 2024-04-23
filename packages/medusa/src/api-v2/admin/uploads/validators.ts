import { createSelectParams } from "../../utils/validators"
import { z } from "zod"

export type AdminGetUploadParamsType = z.infer<typeof AdminGetUploadParams>
export const AdminGetUploadParams = createSelectParams()
