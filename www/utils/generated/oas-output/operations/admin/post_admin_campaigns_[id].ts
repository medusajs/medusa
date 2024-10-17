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
 *         allOf:
 *           - type: object
 *             description: The campaign's details.
 *             required:
 *               - description
 *               - starts_at
 *               - ends_at
 *             properties:
 *               name:
 *                 type: string
 *                 title: name
 *                 description: The campaign's name.
 *               campaign_identifier:
 *                 type: string
 *                 title: campaign_identifier
 *                 description: The campaign's identifier.
 *               description:
 *                 type: string
 *                 title: description
 *                 description: The campaign's description.
 *               budget:
 *                 type: object
 *                 description: The campaign's budget.
 *                 required:
 *                   - limit
 *                 properties:
 *                   limit:
 *                     type: number
 *                     title: limit
 *                     description: The campaign budget's limit.
 *               starts_at:
 *                 type: string
 *                 title: starts_at
 *                 description: The campaign's start date.
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 title: ends_at
 *                 description: The campaign's end date.
 *                 format: date-time
 *               promotions:
 *                 type: array
 *                 description: The campaign's promotions.
 *                 items:
 *                   type: object
 *                   description: The promotions to add to the campaign.
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: A promotion's ID.
 *           - type: object
 *             description: The campaign's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The campaign's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/campaigns/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "description": "{value}",
 *         "starts_at": "2024-08-10T14:44:10.530Z",
 *         "ends_at": "2024-07-13T17:45:37.462Z"
 *       }'
 * tags:
 *   - Campaigns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCampaignResponse"
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
 * x-workflow: updateCampaignsWorkflow
 * 
*/

