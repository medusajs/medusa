import BatchJobService from "../../../services/batch-job"

export async function getRequestedBatchJob(req, res, next) {
  const id = req.params.id
  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")

  let error
  req.batch_job = await batchJobService
    .retrieve(id)
    .catch((err) => (error = err))

  if (error) {
    return next(error)
  }
  next()
}
