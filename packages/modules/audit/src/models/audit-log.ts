import { model } from "@medusajs/framework/utils"

const AuditLog = model
  .define("audit_log", {
    id: model.id({ prefix: "audlog" }).primaryKey(),
    started_at: model.dateTime(),
    ended_at: model.dateTime(),
    actor_type: model.enum([
      "user",
      "api_key",
      "customer",
      "system",
      "anonymous",
    ]),
    actor_id: model.text().searchable().nullable(),
    impersonator_id: model.text().nullable(),
    action: model.text().searchable(),
    resource_type: model.text().searchable().nullable(),
    resource_id: model.text().searchable().nullable(),
    outcome: model.enum(["succeeded", "denied", "failed"]),
    request: model.json().nullable(),
    request_data: model.json().nullable(),
    response_data: model.json().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    { on: ["started_at"] },
    { on: ["actor_id", "started_at"] },
    { on: ["resource_type", "resource_id", "started_at"] },
  ])

export default AuditLog
