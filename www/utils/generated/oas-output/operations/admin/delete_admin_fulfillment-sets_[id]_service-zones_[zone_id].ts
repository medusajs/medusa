/**
 * @oas [delete] /admin/fulfillment-sets/{id}/service-zones/{zone_id}
 * operationId: DeleteFulfillmentSetsIdServiceZonesZone_id
 * summary: Remove a Service Zone from Fulfillment Set
 * x-sidebar-summary: Remove Service Zone
 * description: Remove a service zone that belongs to a fulfillment set.
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
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: "curl -X DELETE '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \\ -H 'x-medusa-access-token: {api_token}'"
 * tags:
 *   - Fulfillment Sets
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The service zone's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               default: service_zone
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the service zone was deleted.
 *             parent:
 *               type: object
 *               description: The fulfillment set that the service zone belongs to.
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
 * x-workflow: deleteServiceZonesWorkflow
 * 
*/

