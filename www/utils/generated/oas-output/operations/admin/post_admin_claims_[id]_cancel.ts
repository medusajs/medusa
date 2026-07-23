/**
 * @oas [post] /admin/claims/{id}/cancel
 * operationId: PostClaimsIdCancel
 * summary: Cancel a Claim
 * description: Cancel a claim and its associated return.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The claim's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCancelClaimReqSchema"
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
 *       sdk.admin.claim.cancel("claim_123")
 *       .then(({ claim }) => {
 *         console.log(claim)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/claims/{id}/cancel' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Claims
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminClaimResponse"
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
 * x-workflow: cancelOrderClaimWorkflow
 * x-events:
 *   - name: reservation-item.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the reservation
 *         order_id, // (optional) The ID of the order, if the reservation was deleted by an order flow
 *       }
 *       ```
 *     description: Emitted when reservations are deleted.
 *     deprecated: false
 *     since: 2.18.0
 * 
*/

