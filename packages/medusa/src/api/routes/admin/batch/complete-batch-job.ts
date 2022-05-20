import { BatchJobService } from "../../../../services"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /batch/{id}/complete
 * operationId: "PostBatchBatchComplete"
 * summary: "Marks a batch job as complete"
 * description: "Marks a batch job as complete"
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
  batch_job = await batchJobService.complete(batch_job)

  res.json({ batch_job })
}
