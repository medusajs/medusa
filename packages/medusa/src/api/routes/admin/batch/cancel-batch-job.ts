import { BatchJobService } from "../../../../services"

/**
 * @oas [post] /batch/{id}/cancel
 * operationId: "PostBatchBatchCancel"
 * summary: "Marks a batch job as cancelled"
 * description: "Marks a batch job as cancelled"
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
  const { id } = req.params

  const userId: string = req.user.id || req.user.userId

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")

  const batch_job = await batchJobService.cancel(id, userId)

  res.json({ batch_job })
}
