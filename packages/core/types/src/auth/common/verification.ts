import { BaseFilterable } from "../../dal"

export type AuthVerificationDTO = {
  id?: string
  // The entity ID is an opaque field that can be an email, phone number, or any other identifier that needs verification.
  entity_id: string
  auth_identity_id: string
  // The kind of entity being verified, such as `email` or `phone_number`.
  entity_type: string
  // The verification provider that handles requesting and confirming the verification, such as `token`.
  code_provider: string
  provider_metadata?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  verified_at?: Date | null
  requested_at: Date
}

export type RequestAuthVerificationDTO = {
  entity_id: string
  auth_identity_id: string
  entity_type: string
  code_provider: string
  metadata?: Record<string, unknown> | null
}

export type RequestAuthVerificationResponse = AuthVerificationDTO & {
  code?: string
  expires_at?: Date
}

export type ConfirmAuthVerificationDTO = {
  // The verification provider can decide if the auth identity is required to confirm the verification.
  auth_identity_id?: string
  code: string
  code_provider?: string
}

export type ConfirmAuthVerificationResponse = AuthVerificationDTO

export interface FilterableAuthVerificationProps
  extends BaseFilterable<FilterableAuthVerificationProps> {
  id?: string[]
  auth_identity_id?: string
  entity_id?: string
  entity_type?: string
  code_provider?: string
}
