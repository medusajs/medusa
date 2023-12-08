import { Request, Response } from "express"
import { IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"

import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [post] /admin/publishable-api-keys/{id}
 * operationId: "PostPublishableApiKysPublishableApiKey"
 * summary: "Update Publishable API Key"
 * description: "Update a Publishable API Key's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Publishable API Key.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPublishableApiKeysPublishableApiKeyReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.update(publishableApiKeyId, {
 *         title: "new title"
 *       })
 *       .then(({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/publishable-api-key/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "new title"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Publishable Api Keys
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPublishableApiKeysRes"
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
    validatedBody: AdminPostPublishableApiKeysPublishableApiKeyReq
  }

  const publishableApiKeysService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const updatedKey = await manager.transaction(async (transactionManager) => {
    return await publishableApiKeysService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  res.status(200).json({ publishable_api_key: updatedKey })
}

/**
 * @schema AdminPostPublishableApiKeysPublishableApiKeyReq
 * type: object
 * properties:
 *   title:
 *     description: The title of the Publishable API Key.
 *     type: string
 */
export class AdminPostPublishableApiKeysPublishableApiKeyReq {
  @IsString()
  @IsOptional()
  title?: string
}
