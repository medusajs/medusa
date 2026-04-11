/**
 * @oas [get] /admin/translations
 * operationId: GetTranslations
 * summary: List Translations
 * description: Retrieve a list of translations. The translations can be filtered by fields such as `reference_id` (For example, the ID of a product). The translations can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: q
 *     in: query
 *     description: Search query to filter translations by their fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search query to filter translations by their fields.
 *   - name: reference_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: reference_id
 *           description: Filter translations by a reference ID. For example, the ID of a product.
 *           example: prod_123
 *         - type: array
 *           description: Filter translations by multiple reference IDs. For example, the IDs of products.
 *           items:
 *             type: string
 *             title: reference_id
 *             description: The reference ID's details. For example, the ID of a product.
 *             example: prod_123
 *   - name: reference
 *     in: query
 *     description: Filter translations by the resource they belong to. For example, `product` or `product_variant`.
 *     required: false
 *     schema:
 *       type: string
 *       title: reference
 *       description: Filter translations by the resource they belong to. For example, `product` or `product_variant`.
 *   - name: locale_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: locale_code
 *           description: Filter translations by a locale code in BCP 47 format.
 *           example: fr-FR
 *         - type: array
 *           description: Filter translations by multiple locale codes in BCP 47 format.
 *           items:
 *             type: string
 *             title: locale_code
 *             description: A locale code in BCP 47 format.
 *             example: fr-FR
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: with_deleted
 *     in: query
 *     description: The translation's with deleted.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: The translation's with deleted.
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
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
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
 *       sdk.admin.translation.list()
 *       .then(({ translations, count, limit, offset }) => {
 *         console.log(translations)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/translations' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Translations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The list of translations with pagination.
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of translations returned.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of translations skipped before retrieving the returned translations.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of translations matching the query.
 *                 estimate_count:
 *                   type: number
 *                   title: estimate_count
 *                   description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *                   x-featureFlag: index_engine
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - translations
 *               properties:
 *                 translations:
 *                   type: array
 *                   description: The list of translations.
 *                   items:
 *                     $ref: "#/components/schemas/AdminTranslation"
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

