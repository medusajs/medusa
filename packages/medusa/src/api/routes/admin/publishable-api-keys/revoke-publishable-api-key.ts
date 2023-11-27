import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [post] /admin/publishable-api-keys/{id}/revoke
 * operationId: "PostPublishableApiKeysPublishableApiKeyRevoke"
 * summary: "Revoke a Publishable API Key"
 * description: "Revoke a Publishable API Key. Revoking the publishable API Key can't be undone, and the key can't be used in future requests."
 * parameters:
 *   - (path) id=* {string} The ID of the Publishable API Key.
 * x-authenticated: true
 * x-codegen:
 *   method: revoke
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.revoke(publishableApiKeyId)
 *       .then(({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/publishable-api-keys/{id}/revoke' \
 *       -H 'x-medusa-access-token: {api_token}'
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

  const publishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  ) as PublishableApiKeyService

  const manager = req.scope.resolve("manager") as EntityManager

  const loggedInUserId = (req.user?.id ?? req.user?.userId) as string

  const pubKey = await manager.transaction(async (transactionManager) => {
    const publishableApiKeyServiceTx =
      publishableApiKeyService.withTransaction(transactionManager)

    await publishableApiKeyServiceTx.revoke(id, { loggedInUserId })
    return await publishableApiKeyServiceTx.retrieve(id)
  })

  return res.json({ publishable_api_key: pubKey })
}
