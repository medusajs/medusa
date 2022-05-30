import { MedusaError } from "medusa-core-utils"
import BatchJobService from "../../../services/batch-job"

export async function canAccessBatchJob(req, res, next) {
  const id = req.params.id
  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  const batch_job = req.batch_job ?? (await batchJobService.retrieve(id))

  const userId = req.user.id ?? req.user.userId
  if (batch_job.created_by !== userId) {
    return next(
      new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot access a batch job that does not belong to the logged in user"
      )
    )
  }

  next()
}
