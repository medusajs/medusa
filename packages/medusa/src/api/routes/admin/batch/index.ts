import { Router } from "express"
import { BatchJob } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { AdminGetBatchParams } from "./list-batch-jobs"
import middlewares, {
  transformQuery,
  getRequestedBatchJob,
  canAccessBatchJob,
} from "../../../middlewares"

export default (app) => {
  const route = Router()

  app.use("/batch", route)

  route.get(
    "/",
    transformQuery(AdminGetBatchParams, {
      defaultFields: defaultAdminBatchFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-batch-jobs").default)
  )
  route.post("/", middlewares.wrap(require("./create-batch-job").default))

  const routerOnBatch = Router()
  route.use("/:id", getRequestedBatchJob, canAccessBatchJob, routerOnBatch)
  routerOnBatch.post(
    "/",
    middlewares.wrap(require("./update-batch-job").default)
  )
  routerOnBatch.post(
    "/confirm",
    middlewares.wrap(require("./confirm-batch-job").default)
  )
  routerOnBatch.post(
    "/complete",
    middlewares.wrap(require("./complete-batch-job").default)
  )
  routerOnBatch.post(
    "/cancel",
    middlewares.wrap(require("./cancel-batch-job").default)
  )

  return app
}

export type AdminBatchJobRes = {
  batch_job: BatchJob
}

export type AdminBatchJobDeleteRes = DeleteResponse

export type AdminBatchJobListRes = PaginatedResponse & {
  batch_jobs: BatchJob[]
}

export const defaultAdminBatchFields = [
  "id",
  "status",
  "type",
  "context",
  "result",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
]

export * from "./list-batch-jobs"
