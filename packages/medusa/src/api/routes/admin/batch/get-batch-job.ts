import { MedusaError } from "medusa-core-utils"
import { BatchJobService } from "../../../../services"
/**
 * @oas [get] /batch/{id}
 * operationId: "GetBatchJobsBatchJob"
 * summary: "Retrieve a Batch Job"
 * description: "Retrieves a Batch Job."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Batch Job
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

  if (userId !== batch_job.created_by) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Cannot retrieve batch jobs created by other users"
    )
  }

  res.status(200).json({ batch_job })
}
