import { model } from "@medusajs/framework/utils"
import { AuthIdentity } from "./auth-identity"
import { ProviderIdentity } from "./provider-identity"

export const AuthVerificationToken = model
  .define("auth_verification_token", {
    id: model.id({ prefix: "authvtok" }).primaryKey(),
    auth_identity: model.belongsTo(() => AuthIdentity, {
      mappedBy: "verification_tokens",
    }),
    provider_identity: model.belongsTo(() => ProviderIdentity, {
      mappedBy: "verification_tokens",
    }),
    entity_id: model.text(),
    token_hash: model.text(),
    expires_at: model.dateTime(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_auth_verification_token_provider_identity_id",
      on: ["provider_identity_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_auth_verification_token_token_hash",
      on: ["token_hash"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_auth_verification_token_expires_at",
      on: ["expires_at"],
      where: "deleted_at IS NULL",
    },
  ])
