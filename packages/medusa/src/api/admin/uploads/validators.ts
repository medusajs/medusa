import { z, type ZodType } from "@zjedene-medusa/framework/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { createSelectParams } from "../../utils/validators"

export type AdminGetUploadParamsType = z.infer<typeof AdminGetUploadParams>
export const AdminGetUploadParams = createSelectParams()

export const AdminUploadPreSignedUrl = z.object({
  originalname: z.string(),
  mime_type: z.string(),
  size: z.number(),
  access: z.enum(["public", "private"]).optional(),
}) satisfies ZodType<HttpTypes.AdminUploadPreSignedUrlRequest>

export type AdminUploadPreSignedUrlType = z.infer<
  typeof AdminUploadPreSignedUrl
>
