import { Router } from "express"
import { BatchJob } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  canAccessBatchJob,
  getRequestedBatchJob,
  transformQuery,
} from "../../../middlewares"
import { AdminGetBatchParams } from "./list-batch-jobs"

export default (app) => {
  const route = Router()

  app.use("/batch-jobs", route)

  route.get(
    "/",
    transformQuery(AdminGetBatchParams, {
      defaultFields: defaultAdminBatchFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-batch-jobs").default)
  )
  route.post("/", middlewares.wrap(require("./create-batch-job").default))

  const batchJobRouter = Router({ mergeParams: true })

  route.use("/:id", getRequestedBatchJob, canAccessBatchJob, batchJobRouter)

  batchJobRouter.get("/", middlewares.wrap(require("./get-batch-job").default))

  batchJobRouter.post(
    "/confirm",
    middlewares.wrap(require("./confirm-batch-job").default)
  )

  batchJobRouter.post(
    "/cancel",
    middlewares.wrap(require("./cancel-batch-job").default)
  )

  return app
}

/**
 * @schema AdminBatchJobRes
 * type: object
 * properties:
 *   batch_job:
 *     $ref: "#/components/schemas/BatchJob"
 */
export type AdminBatchJobRes = {
  batch_job: BatchJob
}

/**
 * @schema AdminBatchJobListRes
 * type: object
 * properties:
 *   batch_jobs:
 *      type: array
 *      items:
 *        $ref: "#/components/schemas/BatchJob"
 *   count:
 *      type: integer
 *      description: The total number of items available
 *   offset:
 *      type: integer
 *      description: The number of items skipped before these items
 *   limit:
 *      type: integer
 *      description: The number of items per page
 */
export type AdminBatchJobListRes = PaginatedResponse & {
  batch_jobs: BatchJob[]
}

export const defaultAdminBatchFields = [
  "id",
  "type",
  "context",
  "result",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "confirmed_at",
  "pre_processed_at",
  "confirmed_at",
  "processing_at",
  "completed_at",
  "canceled_at",
  "failed_at",
]

export * from "./cancel-batch-job"
export * from "./confirm-batch-job"
export * from "./create-batch-job"
export * from "./get-batch-job"
export * from "./list-batch-jobs"
