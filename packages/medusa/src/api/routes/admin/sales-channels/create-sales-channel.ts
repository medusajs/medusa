import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CreateSalesChannelInput } from "../../../../types/sales-channels"
import { EntityManager } from "typeorm"
import SalesChannelService from "../../../../services/sales-channel"

/**
 * @oas [post] /sales-channels
 * operationId: "PostSalesChannels"
 * summary: "Create a Sales Channel"
 * description: "Creates a Sales Channel."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostSalesChannelsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.create({
 *         name: 'App',
 *         description: 'Mobile app'
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Sales Channel
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
  const validatedBody = req.validatedBody as CreateSalesChannelInput
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const salesChannel = await manager.transaction(async (transactionManager) => {
    return await salesChannelService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  res.status(200).json({ sales_channel: salesChannel })
}

/**
 * @schema AdminPostSalesChannelsReq
 * type: object
 * required:
 *   - name
 * properties:
 *   name:
 *     description: The name of the Sales Channel
 *     type: string
 *   description:
 *     description: The description of the Sales Channel
 *     type: string
 *   is_disabled:
 *     description: Whether the Sales Channel is disabled or not.
 *     type: boolean
 */
export class AdminPostSalesChannelsReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean
}
