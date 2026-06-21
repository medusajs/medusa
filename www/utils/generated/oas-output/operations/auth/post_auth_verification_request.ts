/**
 * @oas [post] /auth/verification/request
 * operationId: PostVerificationRequest
 * summary: Create Verification
 * description: Create a verification.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - entity_id
 *           - entity_type
 *           - code_provider
 *         properties:
 *           entity_id:
 *             type: string
 *             title: entity_id
 *             description: The verification's entity id.
 *           entity_type:
 *             type: string
 *             title: entity_type
 *             description: The verification's entity type.
 *           code_provider:
 *             type: string
 *             title: code_provider
 *             description: The verification's code provider.
 *           metadata:
 *             type: object
 *             description: The verification's metadata.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/verification/request' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "entity_id": "{value}",
 *         "entity_type": "{value}",
 *         "code_provider": "{value}"
 *       }'
 * tags:
 *   - Verification
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
 *         code, // The generated verification code.
 *         expires_at, // The code expiry date.
 *         metadata, // Optional custom metadata passed from the request.
 *       }
 *       ```
 *     description: |-
 *       Emitted when a verification code is generated. You can listen to
 *       this event and decide how to deliver the code to the user or customer.
 *     deprecated: false
 *     since: 2.15.5
 * 
*/

