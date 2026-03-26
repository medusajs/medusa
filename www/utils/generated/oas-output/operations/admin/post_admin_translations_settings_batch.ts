/**
 * @oas [post] /admin/translations/settings/batch
 * operationId: PostTranslationsSettingsBatch
 * summary: Manage Translation Settings
 * description: Create, update, or delete multiple translation settings.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminBatchTranslationSettings"
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
 *       sdk.admin.translation.batchSettings({
 *         create: [
 *           {
 *             entity_type: "product",
 *             fields: ["title", "description"],
 *             is_active: true
 *           }
 *         ],
 *         update: [
 *           {
 *             id: "trset_123",
 *             fields: ["title", "description", "subtitle"],
 *             is_active: true
 *           }
 *         ],
 *         delete: ["trset_456"]
 *       })
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/translations/settings/batch' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchTranslationSettingsResponse"
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
 * x-workflow: batchTranslationSettingsWorkflow
 * x-events: []
 * x-since: 2.13.0
 * x-featureFlag: translation
 * 
*/

