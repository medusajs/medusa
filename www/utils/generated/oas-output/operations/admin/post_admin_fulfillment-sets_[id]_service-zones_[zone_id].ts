/**
 * @oas [post] /admin/fulfillment-sets/{id}/service-zones/{zone_id}
 * operationId: PostFulfillmentSetsIdServiceZonesZone_id
 * summary: Update the Service Zone of a Fulfillment Set
 * x-sidebar-summary: Update Service Zone
 * description: Update the details of a service zone in a fulfillment set.
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
 *     description: The service zone's ID.
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
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The service zone's name.
 *           geo_zones:
 *             type: array
 *             description: The service zone's associated geo zones.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: A country geo zone.
 *                   required:
 *                     - type
 *                     - metadata
 *                     - country_code
 *                   properties:
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The geo zone's type.
 *                       default: country
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
 *                       description: The ID of an existing geo zone.
 *                 - type: object
 *                   description: A province geo zone.
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
 *                       default: province
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
 *                       description: The ID of an existing geo zone.
 *                 - type: object
 *                   description: A city geo zone
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
 *                       default: city
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
 *                       description: The ID of an existing geo zone.
 *                 - type: object
 *                   description: A ZIP geo zone.
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
 *                       default: zip
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
 *                       description: The geo zone's postal expression or ZIP code.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The ID of an existing geo zone.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
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
 * x-workflow: updateServiceZonesWorkflow
 * 
*/

