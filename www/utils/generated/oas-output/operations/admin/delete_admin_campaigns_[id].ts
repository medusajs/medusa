/**
 * @oas [delete] /admin/campaigns/{id}
 * operationId: DeleteCampaignsId
 * summary: Delete a Campaign
 * description: |
 *   Delete a campaign by its ID. This doesn't delete promotions that belong to this campaign.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The campaign's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.campaign.delete("procamp_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/campaigns/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Campaigns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The deletion's details.
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The campaign's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the object that was deleted.
 *               default: campaign
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the campaign was deleted.
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
 * x-workflow: deleteCampaignsWorkflow
 * x-events:
 *   - name: campaign.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the campaign
 *       }
 *       ```
 *     description: Emitted when campaigns are deleted.
 *     deprecated: false
 *     since: 2.22.7
 * 
*/

