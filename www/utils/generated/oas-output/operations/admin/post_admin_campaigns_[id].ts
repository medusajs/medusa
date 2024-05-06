/**
 * @oas [post] /admin/campaigns/{id}
 * operationId: PostCampaignsId
 * summary: Update a Campaign
 * description: Update a campaign's details.
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
 *         description: The promotion's campaign.
 *         required:
 *           - name
 *           - campaign_identifier
 *           - description
 *           - currency
 *           - budget
 *           - starts_at
 *           - ends_at
 *           - promotions
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The campaign's name.
 *           campaign_identifier:
 *             type: string
 *             title: campaign_identifier
 *             description: The campaign's campaign identifier.
 *           description:
 *             type: string
 *             title: description
 *             description: The campaign's description.
 *           currency:
 *             type: string
 *             title: currency
 *             description: The campaign's currency.
 *           budget:
 *             type: object
 *             description: The campaign's budget.
 *             properties:
 *               type:
 *                 enum:
 *                   - spend
 *                   - usage
 *                 type: string
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The budget's limit.
 *             required:
 *               - type
 *               - limit
 *           starts_at:
 *             type: string
 *             title: starts_at
 *             description: The campaign's starts at.
 *           ends_at:
 *             type: string
 *             title: ends_at
 *             description: The campaign's ends at.
 *           promotions:
 *             type: array
 *             description: The campaign's promotions.
 *             items:
 *               type: object
 *               description: The promotion's promotions.
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The promotion's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/campaigns/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Janessa"
 *       }'
 * tags:
 *   - Campaigns
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

