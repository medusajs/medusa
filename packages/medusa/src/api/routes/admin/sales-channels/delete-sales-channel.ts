import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { SalesChannelService } from "../../../../services/"

/**
 * @oas [delete] /sales-channels/{id}
 * operationId: "DeleteSalesChannelsSalesChannel"
 * summary: "Delete a sales channel"
 * description: "Deletes the sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales channel.
 * tags:
 *   - Sales Channel
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted sales channel
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: sales-channel
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await salesChannelService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "sales-channel",
    deleted: true,
  })
}
