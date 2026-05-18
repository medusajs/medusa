import { model } from "@medusajs/framework/utils"
import { AuthMfaFactor } from "./auth-mfa-factor"
import { AuthMfaRecoveryCode } from "./auth-mfa-recovery-code"
import { ProviderIdentity } from "./provider-identity"

export const AuthIdentity = model
  .define("auth_identity", {
    id: model.id({ prefix: "authid" }).primaryKey(),
    provider_identities: model.hasMany(() => ProviderIdentity, {
      mappedBy: "auth_identity",
    }),
    mfa_factors: model.hasMany(() => AuthMfaFactor, {
      mappedBy: "auth_identity",
    }),
    mfa_recovery_codes: model.hasMany(() => AuthMfaRecoveryCode, {
      mappedBy: "auth_identity",
    }),
    app_metadata: model.json().nullable(),
  })
  .cascades({
    delete: [
      "provider_identities",
      "mfa_factors",
      "mfa_recovery_codes",
    ],
  })
