import { model } from "@medusajs/framework/utils"

const _ReturnReason = model
  .define("ReturnReason", {
    id: model.id({ prefix: "rr" }).primaryKey(),
    value: model.text().searchable(),
    label: model.text().searchable().translatable(),
    description: model.text().translatable().nullable(),
    metadata: model.json().nullable(),
    parent_return_reason: model
      .belongsTo<() => typeof _ReturnReason>(() => _ReturnReason, {
        mappedBy: "return_reason_children",
      })
      .nullable(),
    return_reason_children: model.hasMany<() => typeof _ReturnReason>(
      () => _ReturnReason,
      {
        mappedBy: "parent_return_reason",
      }
    ),
  })
  .indexes([
    {
      name: "IDX_return_reason_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_return_reason_value",
      on: ["value"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_return_reason_parent_return_reason_id",
      on: ["parent_return_reason_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const ReturnReason = _ReturnReason
