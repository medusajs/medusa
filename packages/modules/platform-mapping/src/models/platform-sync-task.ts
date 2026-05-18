import { model } from "@medusajs/framework/utils"
import { PLATFORM_TYPE, SYNC_ACTION, TASK_STATUS } from "../types"

const PlatformSyncTask = model
  .define("PlatformSyncTask", {
    id: model.id({ prefix: "psync" }).primaryKey(),
    shop_id: model.text(),
    platform_type: model.enum([...PLATFORM_TYPE]),
    action: model.enum([...SYNC_ACTION]),
    payload: model.json(),
    status: model.enum([...TASK_STATUS]).default("pending"),
    error_msg: model.text().nullable(),
    retry_count: model.number().default(0),
  })
  .indexes([
    {
      name: "IDX_platform_sync_task_status",
      on: ["status"],
      where: "deleted_at IS NULL",
    },
  ])

export default PlatformSyncTask
