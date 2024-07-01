/**
 * @oas [post] /admin/fulfillment-sets/{id}/service-zones/{zone_id}
 * operationId: PostFulfillmentSetsIdServiceZonesZone_id
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
 *   - name: zone_id
 *     in: path
 *     description: The fulfillment set's zone id.
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
 *     description: >-
 *       Comma-separated fields that should be included in the returned data.
 *        * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        * without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: >-
 *         Comma-separated fields that should be included in the returned data.
 *          * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *          * without prefix it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
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
 *                     - type
 *                     - metadata
 *                     - country_code
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The geo zone's ID.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - type
 *                     - metadata
 *                     - country_code
 *                     - province_code
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The geo zone's ID.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - type
 *                     - metadata
 *                     - city
 *                     - country_code
 *                     - province_code
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     city:
 *                       type: string
 *                       title: city
 *                       description: The geo zone's city.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The geo zone's ID.
 *                 - type: object
 *                   description: The geo zone's geo zones.
 *                   required:
 *                     - type
 *                     - metadata
 *                     - city
 *                     - country_code
 *                     - province_code
 *                     - postal_expression
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     city:
 *                       type: string
 *                       title: city
 *                       description: The geo zone's city.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     postal_expression:
 *                       type: object
 *                       description: The geo zone's postal expression.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The geo zone's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST
 *       '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \
 * 
 *       -H 'x-medusa-access-token: {api_token}' \
 * 
 *       -H 'Content-Type: application/json' \
 * 
 *       --data-raw '{
 *         "name": "Elvis"
 *       }'
 * tags:
 *   - Fulfillment Sets
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFulfillmentSetResponse"
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

