import { BatchJobService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /batch-jobs/{id}/confirm
 * operationId: "PostBatchJobsBatchJobConfirmProcessing"
 * summary: "Confirm a batch job"
 * description: "Confirms that a previously requested batch job should be executed."
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
  const manager: EntityManager = req.scope.resolve("manager")
  batch_job = await manager.transaction(async (transactionManager) => {
    return await batchJobService
      .withTransaction(transactionManager)
      .confirm(batch_job)
  })

  res.json({ batch_job })
}
