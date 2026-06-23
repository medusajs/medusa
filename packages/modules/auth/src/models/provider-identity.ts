import { model } from "@medusajs/framework/utils"
import { AuthPasswordResetToken } from "./auth-password-reset-token"
import { AuthIdentity } from "./auth-identity"

export const ProviderIdentity = model
  .define("provider_identity", {
    id: model.id().primaryKey(),
    entity_id: model.text(),
    provider: model.text(),
    auth_identity: model.belongsTo(() => AuthIdentity, {
      mappedBy: "provider_identities",
    }),
    password_reset_tokens: model.hasMany(() => AuthPasswordResetToken, {
      mappedBy: "provider_identity",
    }),
    user_metadata: model.json().nullable(),
    provider_metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_provider_identity_provider_entity_id",
      on: ["entity_id", "provider"],
      unique: true,
    },
  ])
  .cascades({
    delete: ["password_reset_tokens"],
  })
