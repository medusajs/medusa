import { model } from "@medusajs/framework/utils"
import { AuthIdentity } from "./auth-identity"

export const AuthVerification = model
  .define("auth_verification", {
    id: model.id({ prefix: "authver" }).primaryKey(),
    auth_identity: model.belongsTo(() => AuthIdentity, {
      mappedBy: "verifications",
    }),
    entity_id: model.text(),
    entity_type: model.text(),
    code_provider: model.text(),
    verified_at: model.dateTime().nullable(),
    requested_at: model.dateTime(),
    provider_metadata: model.json().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_auth_verification_unique_auth_identity_entity_id_entity_type",
      on: ["auth_identity_id", "entity_id", "entity_type"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
