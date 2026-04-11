/**
 * @oas [get] /admin/locales/{code}
 * operationId: GetLocalesCode
 * summary: Get a Locale
 * x-sidebar-summary: Get Locale
 * description: Retrieve a locale by its code. You can expand the locale's relations or select the fields that should be returned.
 * x-authenticated: true
 * parameters:
 *   - name: code
 *     in: path
 *     description: The locale's code in [BCP 47 format](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1).
 *     example: fr-FR
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
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
 *       sdk.admin.locale.retrieve("en-US")
 *       .then(({ locale }) => {
 *         console.log(locale)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/locales/fr-FR' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Locales
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminLocaleResponse"
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

