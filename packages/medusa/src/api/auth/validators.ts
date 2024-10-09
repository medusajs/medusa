import { z } from "zod"

export const ResetPasswordRequest = z.object({
  identifier: z.string(),
})
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>
