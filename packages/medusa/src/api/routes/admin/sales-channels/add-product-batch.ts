import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { ProductBatchSalesChannel } from "../../../../types/sales-channels"
import { SalesChannelService } from "../../../../services"
import { Type } from "class-transformer"

/**
 * @oas [post] /sales-channels/{id}/products/batch
 * operationId: "PostSalesChannelsChannelProductsBatch"
 * summary: "Assign a batch of product to a sales channel"
 * description: "Assign a batch of product to a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales channel.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - product_ids
 *         properties:
 *           product_ids:
 *             description: The IDs of the products to add to the Sales Channel
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the product
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
export default async (req: Request, res: Response): Promise<void> => {
  const validatedBody =
    req.validatedBody as AdminPostSalesChannelsChannelProductsBatchReq

  const { id } = req.params

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const salesChannel = await manager.transaction(async (transactionManager) => {
    return await salesChannelService
      .withTransaction(transactionManager)
      .addProducts(
        id,
        validatedBody.product_ids.map((p) => p.id)
      )
  })

  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminPostSalesChannelsChannelProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchSalesChannel)
  product_ids: ProductBatchSalesChannel[]
}
