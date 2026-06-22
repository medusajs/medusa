/**
 * @oas [post] /auth/{actor_type}/{auth_provider}/verification/request
 * operationId: PostActor_typeAuth_providerVerificationRequest
 * summary: Add Request to [actor_type]
 * description: Add a Request to a [actor_type]
 * x-authenticated: false
 * parameters:
 *   - name: actor_type
 *     in: path
 *     description: The [actor type]'s actor type.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The [actor type]'s auth provider.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - entity_id
 *         properties:
 *           entity_id:
 *             type: string
 *             title: entity_id
 *             description: The [actor type]'s entity id.
 *           metadata:
 *             type: object
 *             description: The [actor type]'s metadata.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/{actor_type}/{auth_provider}/verification/request' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "entity_id": "{value}"
 *       }'
 * tags:
 *   - "[actor_type]"
 * responses:
 *   "201":
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
 * x-workflow: requestVerificationWorkflow
 * x-events:
 *   - name: auth.verification_requested
 *     payload: |-
 *       ```ts
 *       {
 *         entity_id, // The identifier of the user or customer. For example, an email address.
 *         actor_type, // The type of actor. For example, "customer", "user", or custom.
 *         provider, // The auth provider that requested verification.
 *         auth_identity_id, // The ID of the auth identity being verified.
 *         provider_identity_id, // The ID of the provider identity being verified.
 *         token, // The generated token.
 *         expires_at, // The token expiry date.
 *         metadata, // Optional custom metadata passed from the request.
 *       }
 *       ```
 *     description: |-
 *       Emitted when a verification token is generated. You can listen to
 *       this event and decide how to deliver the token to the user or customer.
 *     deprecated: false
 *     since: 2.15.5
 * 
*/

