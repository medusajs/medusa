import { z } from "@medusajs/framework/zod"

export const ResetPasswordRequest = z.object({
  identifier: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
})
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>

export const VerificationRequest = z.object({
  entity_id: z.string().min(1),
  entity_type: z.string().min(1),
  code_provider: z.string().min(1).default("token"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
})
export type VerificationRequestType = z.infer<typeof VerificationRequest>

export const VerificationConfirmRequest = z.object({
  code: z.string().min(1),
  code_provider: z.string().min(1).optional(),
})
export type VerificationConfirmRequestType = z.infer<
  typeof VerificationConfirmRequest
>

export const AuthMfaVerifyChallengeRequest = z.object({
  method: z.string().min(1),
  code: z.string().min(1),
})
export type AuthMfaVerifyChallengeRequestType = z.infer<
  typeof AuthMfaVerifyChallengeRequest
>

export const AuthMfaCreateFactorRequest = z.object({
  provider: z.string().min(1),
  label: z.string().nullable().optional(),
  issuer: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})
export type AuthMfaCreateFactorRequestType = z.infer<
  typeof AuthMfaCreateFactorRequest
>

export const AuthMfaVerifyFactorRequest = z.object({
  code: z.string().min(1),
})
export type AuthMfaVerifyFactorRequestType = z.infer<
  typeof AuthMfaVerifyFactorRequest
>

export const AuthMfaDisableFactorRequest = z.object({
  method: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
})
export type AuthMfaDisableFactorRequestType = z.infer<
  typeof AuthMfaDisableFactorRequest
>

export const AuthMfaGenerateRecoveryCodesRequest = z.object({
  count: z.number().int().min(1).max(50).optional(),
})
export type AuthMfaGenerateRecoveryCodesRequestType = z.infer<
  typeof AuthMfaGenerateRecoveryCodesRequest
>
