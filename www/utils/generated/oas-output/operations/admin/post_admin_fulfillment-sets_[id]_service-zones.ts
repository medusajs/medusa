/**
 * @oas [post] /admin/fulfillment-sets/{id}/service-zones
 * operationId: PostFulfillmentSetsIdServiceZones
 * summary: Add a Service Zone to a Fulfillment Set
 * x-sidebar-summary: Add Service Zone
 * description: Add a service zone to a fulfillment set.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment set's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The service zone's details.
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The service zone's name.
 *           geo_zones:
 *             type: array
 *             description: The service zone's geo zones.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: A country geo zone.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                       default: country
 *                 - type: object
 *                   description: A province geo zone.
 *                   required:
 *                     - metadata
 *                     - country_code
 *                     - type
 *                     - province_code
 *                   properties:
 *                     metadata:
 *                       type: object
 *                       description: The geo zone's metadata.
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                       default: province
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                 - type: object
 *                   description: A city geo zone
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
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                       default: city
 *                     province_code:
 *                       type: string
 *                       title: province_code
 *                       description: The geo zone's province code.
 *                     city:
 *                       type: string
 *                       title: city
 *                       description: The geo zone's city.
 *                 - type: object
 *                   description: A ZIP geo zone.
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
 *                     country_code:
 *                       type: string
 *                       title: country_code
 *                       description: The geo zone's country code.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                       default: zip
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
 *                       description: The geo zone's postal expression or ZIP code.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Layla"
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
 * x-workflow: createServiceZonesWorkflow
 * 
*/

