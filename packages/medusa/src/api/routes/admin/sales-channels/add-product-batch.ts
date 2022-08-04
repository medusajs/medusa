import { Request, Response } from "express"
import { SalesChannelService } from "../../../../services"
import { IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ProductBatchSalesChannel } from "../../../../types/sales-channels"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /sales-channels/{id}/products/batch
 * operationId: "PostSalesChannelsChannelProductsBatch"
 * summary: "Assign a batch of product to a sales channel"
 * description: "Assign a batch of product to a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Sales channel.
 *   - (body) product_ids=* {ProductBatchSalesChannel} The product ids that must be assigned to the sales channel.
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
