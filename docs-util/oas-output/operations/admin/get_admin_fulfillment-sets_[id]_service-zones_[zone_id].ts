/**
 * @oas [get] /admin/fulfillment-sets/{id}/service-zones/{zone_id}
 * operationId: GetFulfillmentSetsIdServiceZonesZone_id
 * summary: List Service Zones
 * description: Retrieve a list of service zones in a fulfillment set. The service
 *   zones can be filtered by fields like FILTER FIELDS. The service zones can also
 *   be paginated.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \
 *       -H 'x-medusa-access-token: {api_token}'
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

