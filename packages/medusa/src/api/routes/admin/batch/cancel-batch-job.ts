import { BatchJobService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /batch-jobs/{id}/cancel
 * operationId: "PostBatchJobsBatchJobCancel"
 * summary: "Marks a batch job as canceled"
 * description: "Marks a batch job as canceled"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the batch job.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.batchJobs.cancel(batch_job_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/batch-jobs/{id}/cancel' \
 *       --header 'Authorization: Bearer {api_token}'
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
  const manager: EntityManager = req.scope.resolve("manager")
  batch_job = await manager.transaction(async (transactionManager) => {
    return await batchJobService
      .withTransaction(transactionManager)
      .cancel(batch_job)
  })

  res.json({ batch_job })
}
