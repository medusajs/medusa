/**
 * @oas [get] /admin/translations/settings
 * operationId: GetTranslationsSettings
 * summary: List Translations
 * description: Retrieve a list of translations. The translations can be filtered by fields such as `id`. The translations can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: entity_type
 *     in: query
 *     description: The translation's entity type.
 *     required: false
 *     schema:
 *       type: string
 *       title: entity_type
 *       description: The translation's entity type.
 *   - name: is_active
 *     in: query
 *     description: The translation's is active.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: is_active
 *       description: The translation's is active.
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
 *       sdk.admin.translation.settings({
 *         entity_type: "product"
 *       })
 *       .then(({ translation_settings }) => {
 *         console.log(translation_settings)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/translations/settings' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTranslationSettingsResponse"
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
 * x-since: 2.12.3
 * x-featureFlag: translation
 * 
*/

