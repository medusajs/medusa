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
 *                     - type
 *                     - metadata
 *                     - country_code
 *                     - id
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
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
 *                     - id
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
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
 *                     - id
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
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
 *                     - id
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                       properties: {}
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
 *                       properties: {}
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
 *         "name": "Delphia",
 *         "geo_zones": []
 *       }'
 * tags:
 *   - Fulfillment Sets
 * responses:
 *   "200":
 *     description: OK
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

