import { Router } from "express"
import { BatchJob } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  getRequestedBatchJob,
  canAccessBatchJob,
} from "../../../middlewares"

export default (app) => {
  const route = Router()

  app.use("/batch", route)

  route.get(
    "/",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-batch-jobs").default)
  )
  route.post("/", middlewares.wrap(require("./create-batch-job").default))

  const routerOnBatch = Router()
  route.use("/:id", getRequestedBatchJob, canAccessBatchJob, routerOnBatch)
  routerOnBatch.get("/", middlewares.wrap(require("./get-batch-job").default))
  routerOnBatch.post(
    "/confirm",
    middlewares.wrap(require("./confirm-batch-job").default)
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
  "type",
  "context",
  "result",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
]

export * from "./list-batch-jobs"
