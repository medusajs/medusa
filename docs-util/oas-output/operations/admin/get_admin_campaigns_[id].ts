/**
 *
 * @oas [get] /admin/campaigns/{id}
 * operationId: GetCampaignsId
 * summary: Get a Campaign
 * description: Retrieve a campaign by its ID. You can expand the campaign's
 *   relations or select the fields that should be returned.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The campaign's ID.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/campaigns/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Campaigns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - campaign
 *           properties:
 *             campaign:
 *               type: object
 *               description: The campaign's details.
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The campaign's ID.
 *                 name:
 *                   type: string
 *                   title: name
 *                   description: The campaign's name.
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The campaign's description.
 *                 currency:
 *                   type: string
 *                   title: currency
 *                   description: The campaign's currency.
 *                 campaign_identifier:
 *                   type: string
 *                   title: campaign_identifier
 *                   description: The campaign's campaign identifier.
 *                 starts_at:
 *                   type: string
 *                   title: starts_at
 *                   description: The campaign's starts at.
 *                   format: date-time
 *                 ends_at:
 *                   type: string
 *                   title: ends_at
 *                   description: The campaign's ends at.
 *                   format: date-time
 *                 budget:
 *                   type: object
 *                   description: The campaign's budget.
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The budget's ID.
 *                     type:
 *                       type: string
 *                       enum:
 *                         - spend
 *                         - usage
 *                     limit:
 *                       type: number
 *                       title: limit
 *                       description: The budget's limit.
 *                     used:
 *                       type: number
 *                       title: used
 *                       description: The budget's used.
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

