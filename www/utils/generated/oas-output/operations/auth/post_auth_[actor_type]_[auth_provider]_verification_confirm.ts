/**
 * @oas [post] /auth/{actor_type}/{auth_provider}/verification/confirm
 * operationId: PostActor_typeAuth_providerVerificationConfirm
 * summary: Verify the Customer's Email
 * description: Verifies the customer's email using a token that is typically sent to their email address. This is used to confirm the customer's email during registration or authentication when [email
 *   verification is required](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/emailpass). You can listen to the `auth.verification_requested` event in a subscriber and send an
 *   email to the customer with the verification token.
 * x-authenticated: false
 * parameters:
 *   - name: actor_type
 *     in: path
 *     description: The actor type, which is `customer` in this case.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The authentication provider, which is `emailpass` in this case.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details required to verify the customer's email.
 *         required:
 *           - token
 *         properties:
 *           token:
 *             type: string
 *             title: token
 *             description: The verification token sent to the customer's email address.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/customer/emailpass/verification/confirm' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "token": "{value}"
 *       }'
 * tags:
 *   - "[actor_type]"
 * responses:
 *   "200":
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
 * 
*/

