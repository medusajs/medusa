import { BatchJobService } from "../../../../services"

/**
 * @oas [post] /batch-jobs/{id}/cancel
 * operationId: "PostBatchJobsBatchJobCancel"
 * summary: "Marks a batch job as canceled"
 * description: "Marks a batch job as canceled"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the batch job.
 * tags:
 *   - Batch Job
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            batch_job:
 *              $ref: "#/components/schemas/batch_job"
 */
export default async (req, res) => {
  let batch_job = req.batch_job

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  batch_job = await batchJobService.cancel(batch_job)

  res.json({ batch_job })
}
