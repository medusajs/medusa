/**
 * @oas [post] /admin/fulfillment-sets/{id}/service-zones
 * operationId: PostFulfillmentSetsIdServiceZones
 * summary: Add Service Zones to Fulfillment Set
 * description: Add a list of service zones to a fulfillment set.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment set's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - name
 *           - geo_zones
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The fulfillment set's name.
 *           geo_zones:
 *             type: array
 *             description: The fulfillment set's geo zones.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                     - province_code
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                     - province_code
 *                     - city
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     city:
 *                       type: string
 *                       title: city
 *                       description: The geo zone's city.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                     - province_code
 *                     - city
 *                     - postal_expression
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     city:
 *                       type: string
 *                       title: city
 *                       description: The geo zone's city.
 *                     postal_expression:
 *                       type: object
 *                       description: The geo zone's postal expression.
 *                       properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Milan",
 *         "geo_zones": []
 *       }'
 * tags:
 *   - Fulfillment Sets
 * responses:
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
 * 
*/

