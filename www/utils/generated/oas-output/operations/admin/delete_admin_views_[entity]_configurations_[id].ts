/**
 * @oas [delete] /admin/views/{entity}/configurations/{id}
 * operationId: DeleteViewsEntityConfigurationsId
 * summary: Remove View Configurations
 * description: Remove view configurations of an entity. An admin user can only delete their own configurations.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: path
 *     description: The entity to delete its view configuration (for example, `orders`)
 *     required: true
 *     schema:
 *       type: string
 *   - name: id
 *     in: path
 *     description: The ID of the view configuration to delete
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       const { id, object, deleted } = await sdk.admin.views.deleteConfiguration(
 *         "orders",
 *         "viewconfig_123"
 *       )
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/views/{entity}/configurations/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Views
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The details of the deletion operation.
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The ID of the deleted View Configuration.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               example: view_configuration
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the view was deleted.
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
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

