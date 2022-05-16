import BatchJobService from "../../../services/batch-job"

export async function getRequestedBatchJob(req, res, next) {
  const id = req.params.id
  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  req.batch_job = await batchJobService.retrieve(id)
  next()
}
