/**
 * @oas [get] /admin/property-labels
 * operationId: GetPropertyLabels
 * summary: List Property Labels
 * description: Retrieve a list of property labels. The property labels can be filtered by fields such as `id`. The property labels can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: query
 *     description: The property label's entity.
 *     required: false
 *     schema:
 *       type: string
 *       title: entity
 *       description: The property label's entity.
 *   - name: property
 *     in: query
 *     description: The property label's property.
 *     required: false
 *     schema:
 *       type: string
 *       title: property
 *       description: The property label's property.
 *   - name: q
 *     in: query
 *     description: The property label's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The property label's q.
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
 *     description: The property label's with deleted.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: The property label's with deleted.
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
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/property-labels' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Property Labels
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPropertyLabelListResponse"
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
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

