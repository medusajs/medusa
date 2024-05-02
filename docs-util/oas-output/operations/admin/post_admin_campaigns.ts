/**
 * @oas [post] /admin/campaigns
 * operationId: PostCampaigns
 * summary: Create Campaign
 * description: Create a campaign.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/campaigns' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
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
 *             required:
 *               - type
 *               - limit
 *             properties:
 *               type: {}
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The budget's limit.
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
 * 
*/

