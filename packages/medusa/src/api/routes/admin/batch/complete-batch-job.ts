import { MedusaError } from "medusa-core-utils"
import { BatchJobService } from "../../../../services"

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
  const { id } = req.params

  const userId: string = req.user.id || req.user.userId

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")

  const batch_job = await batchJobService.retrieve(id)

  if (batch_job.created_by !== userId) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Cannot complete batch jobs created by other users"
    )
  }

  const result = await batchJobService.complete(id, userId)

  res.json({ batch_job: result })
}
