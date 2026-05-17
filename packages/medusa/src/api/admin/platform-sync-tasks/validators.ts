import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const PlatformType = z.enum([
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
])
const SyncAction = z.enum(["create", "update", "delist", "delete"])
const TaskStatus = z.enum(["pending", "processing", "success", "failed"])

export const AdminCreatePlatformSyncTask = z.object({
  shop_id: z.string(),
  platform_type: PlatformType,
  action: SyncAction,
  payload: z.record(z.string(), z.unknown()),
  status: TaskStatus.optional(),
  error_msg: z.string().optional(),
  retry_count: z.number().optional(),
})

export type AdminCreatePlatformSyncTaskType = z.infer<
  typeof AdminCreatePlatformSyncTask
>

export const AdminUpdatePlatformSyncTask = z.object({
  shop_id: z.string().optional(),
  platform_type: PlatformType.optional(),
  action: SyncAction.optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  status: TaskStatus.optional(),
  error_msg: z.string().optional(),
  retry_count: z.number().optional(),
})

export type AdminUpdatePlatformSyncTaskType = z.infer<
  typeof AdminUpdatePlatformSyncTask
>

export const AdminGetPlatformSyncTaskParams = createSelectParams()

export const AdminGetPlatformSyncTasksParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    shop_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    platform_type: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    action: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    status: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
