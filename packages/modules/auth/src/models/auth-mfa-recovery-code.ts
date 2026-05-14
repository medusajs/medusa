import { model } from "@medusajs/framework/utils"
import { AuthIdentity } from "./auth-identity"

export const AuthMfaRecoveryCode = model
  .define("auth_mfa_recovery_code", {
    id: model.id({ prefix: "authmfarec" }).primaryKey(),
    auth_identity: model.belongsTo(() => AuthIdentity, {
      mappedBy: "mfa_recovery_codes",
    }),
    code_hash: model.text(),
  })
  .indexes([
    {
      name: "IDX_auth_mfa_recovery_code_auth_identity_id",
      on: ["auth_identity_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_auth_mfa_recovery_code_auth_identity_code_hash",
      on: ["auth_identity_id", "code_hash"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
