import { Request, Response } from "express"
import { SalesChannelService } from "../../../../services/"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /sales-channels/{id}
 * operationId: "DeleteSalesChannelsSalesChannel"
 * summary: "Delete a sales channel"
 * description: "Deletes the sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Sales channel.
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
 *               description: The id of the deleted Sales Channel.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
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
