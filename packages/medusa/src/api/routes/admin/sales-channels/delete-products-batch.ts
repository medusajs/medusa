import { IsArray, ValidateNested } from "class-validator"
import { Request, Response } from "express"
import { Type } from "class-transformer"
import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { detachProductsFromSalesChannelWorkflow } from "@medusajs/core-flows"

import { EntityManager } from "typeorm"
import { ProductBatchSalesChannel } from "../../../../types/sales-channels"
import { SalesChannelService } from "../../../../services"

/**
 * @oas [delete] /admin/sales-channels/{id}/products/batch
 * operationId: "DeleteSalesChannelsChannelProductsBatch"
 * summary: "Remove Products from Sales Channel"
 * description: "Remove a list of products from a sales channel. This does not delete the product. It only removes the association between the product and the sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales Channel
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteSalesChannelsChannelProductsBatchReq"
 * x-codegen:
 *   method: removeProducts
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.removeProducts(salesChannelId, {
 *         product_ids: [
 *           {
 *             id: productId
 *           }
 *         ]
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id)
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import {
 *         useAdminDeleteProductsFromSalesChannel,
 *       } from "medusa-react"
 *
 *       type Props = {
 *         salesChannelId: string
 *       }
 *
 *       const SalesChannel = ({ salesChannelId }: Props) => {
 *         const deleteProducts = useAdminDeleteProductsFromSalesChannel(
 *           salesChannelId
 *         )
 *         // ...
 *
 *         const handleDeleteProducts = (productId: string) => {
 *           deleteProducts.mutate({
 *             product_ids: [
 *               {
 *                 id: productId,
 *               },
 *             ],
 *           }, {
 *             onSuccess: ({ sales_channel }) => {
 *               console.log(sales_channel.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default SalesChannel
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/sales-channels/{id}/products/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "product_ids": [
 *             {
 *               "id": "{product_id}"
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Sales Channels
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSalesChannelsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req: Request, res: Response) => {
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const validatedBody =
    req.validatedBody as AdminDeleteSalesChannelsChannelProductsBatchReq
  const { id } = req.params

  let salesChannel

  const manager: EntityManager = req.scope.resolve("manager")
  const isMedusaV2FlagEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  if (isMedusaV2FlagEnabled) {
    const detachProductsWorkflow = detachProductsFromSalesChannelWorkflow(
      req.scope
    )

    await detachProductsWorkflow.run({
      input: {
        salesChannelId: id,
        productIds: validatedBody.product_ids.map((p) => p.id),
      },
      context: { manager },
    })
  } else {
    const salesChannelService: SalesChannelService = req.scope.resolve(
      "salesChannelService"
    )
    salesChannel = await manager.transaction(async (transactionManager) => {
      return await salesChannelService
        .withTransaction(transactionManager)
        .removeProducts(
          id,
          validatedBody.product_ids.map((p) => p.id)
        )
    })
  }

  res.status(200).json({ sales_channel: salesChannel })
}

/**
 * @schema AdminDeleteSalesChannelsChannelProductsBatchReq
 * type: object
 * description: "The details of the products to delete from the sales channel."
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: The IDs of the products to remove from the sales channel.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a product
 *           type: string
 */
export class AdminDeleteSalesChannelsChannelProductsBatchReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBatchSalesChannel)
  product_ids: ProductBatchSalesChannel[]
}
