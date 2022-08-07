import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { ProductBatchSalesChannel } from "../../../../types/sales-channels"
import { SalesChannelService } from "../../../../services"
import { Type } from "class-transformer"

/**
 * @oas [delete] /sales-channels/{id}/products/batch
 * operationId: "DeleteSalesChannelsChannelProductsBatch"
 * summary: "Remove a list of products from a sales channel"
 * description: "Remove a list of products from a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales Channel
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - product_ids
 *         properties:
 *           product_ids:
 *             description: The IDs of the products to delete from the Sales Channel.
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: The ID of a product
 *                   type: string
 * tags:
 *   - Sales Channel
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             sales_channel:
 *               $ref: "#/components/schemas/sales_channel"
 */

export default async (req: Request, res: Response) => {
  const validatedBody =
    req.validatedBody as AdminDeleteSalesChannelsChannelProductsBatchReq
  const { id } = req.params

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const salesChannel = await manager.transaction(async (transactionManager) => {
    return await salesChannelService
      .withTransaction(transactionManager)
      .removeProducts(
        id,
        validatedBody.product_ids.map((p) => p.id)
      )
  })

  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminDeleteSalesChannelsChannelProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchSalesChannel)
  product_ids: ProductBatchSalesChannel[]
}
