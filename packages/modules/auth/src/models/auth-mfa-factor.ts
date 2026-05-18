import { model } from "@medusajs/framework/utils"
import { AuthIdentity } from "./auth-identity"

export const AuthMfaFactor = model
  .define("auth_mfa_factor", {
    id: model.id({ prefix: "authmfa" }).primaryKey(),
    auth_identity: model.belongsTo(() => AuthIdentity, {
      mappedBy: "mfa_factors",
    }),
    provider: model.text(),
    status: model.text(),
    provider_metadata: model.json().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_auth_mfa_factor_auth_identity_id",
      on: ["auth_identity_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_auth_mfa_factor_auth_identity_provider_active",
      on: ["auth_identity_id", "provider"],
      unique: true,
      where: "deleted_at IS NULL AND status IN ('pending', 'enabled')",
    },
  ])
