/**
 * @oas [post] /admin/campaigns
 * operationId: PostCampaigns
 * summary: Create Campaign
 * description: Create a campaign.
 * x-authenticated: true
 * parameters:
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
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
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
 *           - campaign_identifier
 *           - description
 *           - budget
 *           - starts_at
 *           - ends_at
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
 *           budget:
 *             type: object
 *             description: The campaign's budget.
 *             required:
 *               - type
 *               - limit
 *               - currency_code
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                   - spend
 *                   - usage
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The budget's limit.
 *               currency_code:
 *                 type: string
 *                 title: currency_code
 *                 description: The budget's currency code.
 *           starts_at:
 *             type: string
 *             title: starts_at
 *             description: The campaign's starts at.
 *             format: date-time
 *           ends_at:
 *             type: string
 *             title: ends_at
 *             description: The campaign's ends at.
 *             format: date-time
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
 *       curl -X POST '{backend_url}/admin/campaigns' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Gunner",
 *         "campaign_identifier": "{value}",
 *         "description": "{value}",
 *         "starts_at": "2024-08-24T00:19:14.144Z",
 *         "ends_at": "2024-10-01T06:47:50.133Z"
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

