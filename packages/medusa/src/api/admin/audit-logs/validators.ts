import { z } from "@medusajs/framework/zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

const stringOrArray = z.union([z.string(), z.array(z.string())])

const dateRange = z
  .object({
    $gt: z.string().datetime({ offset: true }).optional(),
    $gte: z.string().datetime({ offset: true }).optional(),
    $lt: z.string().datetime({ offset: true }).optional(),
    $lte: z.string().datetime({ offset: true }).optional(),
  })
  .strict()

const outcome = z.enum(["succeeded", "denied", "failed"])

export type AdminGetAuditLogParamsType = z.infer<typeof AdminGetAuditLogParams>
export const AdminGetAuditLogParams = createSelectParams()

export type AdminGetAuditLogsParamsType = z.infer<
  typeof AdminGetAuditLogsParams
>
export const AdminGetAuditLogsParams = createFindParams({
  offset: 0,
  limit: 20,
})
  .omit({ with_deleted: true })
  .merge(
    z.object({
      order: z
        .enum(["started_at", "-started_at"])
        .optional()
        .default("-started_at"),
      q: z.string().optional(),
      id: stringOrArray.optional(),
      actor_type: stringOrArray.optional(),
      actor_id: stringOrArray.optional(),
      action: stringOrArray.optional(),
      resource_type: stringOrArray.optional(),
      resource_id: stringOrArray.optional(),
      outcome: z.union([outcome, z.array(outcome)]).optional(),
      started_at: dateRange.optional(),
    })
  )
