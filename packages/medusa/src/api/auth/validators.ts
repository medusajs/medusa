import { z } from "@medusajs/framework/zod"

export const ResetPasswordRequest = z.object({
  identifier: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
})
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>

export const AuthMfaVerifyChallengeRequest = z.object({
  provider: z.string().min(1),
  code: z.string().min(1),
})
export type AuthMfaVerifyChallengeRequestType = z.infer<
  typeof AuthMfaVerifyChallengeRequest
>

export const AuthMfaStartRequest = z.object({
  provider: z.string().min(1),
  label: z.string().nullable().optional(),
  issuer: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})
export type AuthMfaStartRequestType = z.infer<
  typeof AuthMfaStartRequest
>

export const AuthMfaVerifyRequest = z.object({
  code: z.string().min(1),
})
export type AuthMfaVerifyRequestType = z.infer<
  typeof AuthMfaVerifyRequest
>

export const AuthMfaDisableRequest = z.object({
  provider: z.string().min(1),
  code: z.string().min(1),
})
export type AuthMfaDisableRequestType = z.infer<
  typeof AuthMfaDisableRequest
>

export const AuthMfaGenerateRecoveryCodesRequest = z.object({
  count: z.number().int().min(1).max(50).optional(),
})
export type AuthMfaGenerateRecoveryCodesRequestType = z.infer<
  typeof AuthMfaGenerateRecoveryCodesRequest
>
