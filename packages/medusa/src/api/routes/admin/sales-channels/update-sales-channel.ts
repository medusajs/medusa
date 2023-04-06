import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { SalesChannelService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/sales-channels/{id}
 * operationId: "PostSalesChannelsSalesChannel"
 * summary: "Update a Sales Channel"
 * description: "Updates a Sales Channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales Channel.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostSalesChannelsSalesChannelReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.update(sales_channel_id, {
 *         name: 'App'
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostSalesChannelsSalesChannelReq
  }

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
  const sales_channel = await manager.transaction(
    async (transactionManager) => {
      return await salesChannelService
        .withTransaction(transactionManager)
        .update(id, validatedBody)
    }
  )

  res.status(200).json({ sales_channel })
}

/**
 * @schema AdminPostSalesChannelsSalesChannelReq
 * type: object
 * properties:
 *   name:
 *     type: string
 *     description: Name of the sales channel.
 *   description:
 *     type: string
 *     description:  Sales Channel description.
 *   is_disabled:
 *     type: boolean
 *     description:  Indication of if the sales channel is active.
 */
export class AdminPostSalesChannelsSalesChannelReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean
}
