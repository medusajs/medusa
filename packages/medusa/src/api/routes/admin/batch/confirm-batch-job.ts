import { BatchJobService } from "../../../../services"

/**
 * @oas [post] /batch/{id}/confirm
 * operationId: "PostBatchBatchComfirm"
 * summary: "Emit an event of type PROCESS_COMPLETE"
 * description: "Emit an event of type PROCESS_COMPLETE"
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
 *          properties:x
 *            batch_job:
 *              $ref: "#/components/schemas/batch_job"
 */

export default async (req, res) => {
  let batch_job = req.batch_job

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  batch_job = await batchJobService.confirm(batch_job)

  res.json({ batch_job })
}
