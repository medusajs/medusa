import { Type } from "class-transformer"
import { IsArray, ValidateNested } from "class-validator"
import { SalesChannelService } from "../../../../services"
import { Request, Response } from "express"
import { ProductBatchSalesChannel } from "../../../../types/sales-channels"

/**
 * @oas [delete] /sales-channels/{id}/products/batch
 * operationId: "DeleteSalesChannelsChannelProductsBatch"
 * summary: "Remove a list of products from a sales channel"
 * description: "Remove a list of products from a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
 *   - (body) product_ids=* {ProductBatchSalesChannel[]} ids of the product to remove
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
  const { id } = req.params

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const validatedBody =
    req.validatedBody as AdminDeleteSalesChannelsChannelProductsBatchReq
  const salesChannel = await salesChannelService.removeProducts(
    id,
    validatedBody.product_ids.map((p) => p.id)
  )
  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminDeleteSalesChannelsChannelProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchSalesChannel)
  product_ids: ProductBatchSalesChannel[]
}
