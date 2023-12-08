import { EntityManager } from "typeorm"

import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [delete] /admin/publishable-api-keys/{id}
 * operationId: "DeletePublishableApiKeysPublishableApiKey"
 * summary: "Delete Publishable API Key"
 * description: "Delete a Publishable API Key. Associated resources, such as sales channels, are not deleted."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Publishable API Key to delete.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.delete(publishableApiKeyId)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/publishable-api-key/{id}' \
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
 *           $ref: "#/components/schemas/AdminPublishableApiKeyDeleteRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 */

export default async (req, res) => {
  const { id } = req.params

  const publishableApiKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await publishableApiKeyService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.status(200).send({
    id,
    object: "publishable_api_key",
    deleted: true,
  })
}
