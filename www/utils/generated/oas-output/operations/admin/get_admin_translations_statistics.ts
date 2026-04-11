/**
 * @oas [get] /admin/translations/statistics
 * operationId: GetTranslationsStatistics
 * summary: Retrieve Translation Statistics
 * x-sidebar-summary: Get Statistics
 * description: Get statistics on translations for specified locales and entity types. This includes overall translation progress for each entity type, and statistics for each locale within those entity types.
 * x-authenticated: true
 * parameters:
 *   - name: locales
 *     in: query
 *     description: The locale codes to retrieve translation statistics for. Locale codes are in [BCP 47](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1) format.
 *     required: true
 *     schema:
 *       type: array
 *       description: The locale codes to retrieve translation statistics for.
 *       items:
 *         type: string
 *         title: locales
 *         description: A locale code in [BCP 47](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1) format.
 *         example: fr-FR
 *   - name: entity_types
 *     in: query
 *     description: The table names of entities to retrieve translation statistics for.
 *     required: true
 *     schema:
 *       type: array
 *       description: The table names of entities to retrieve translation statistics for.
 *       items:
 *         type: string
 *         title: entity_types
 *         description: The table name of an entity.
 *         example: products
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
 *       sdk.admin.translation.statistics({
 *         entity_type: "product"
 *       })
 *       .then(({ statistics }) => {
 *         console.log(statistics)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/translations/statistics' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTranslationStatisticsResponse"
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

