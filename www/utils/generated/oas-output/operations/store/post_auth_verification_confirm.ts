/**
 * @oas [post] /auth/verification/confirm
 * operationId: PostVerificationConfirm
 * summary: Confirm Customer Verification
 * x-sidebar-summary: Confirm Verification
 * description: Confirm a verification token of the customer. This API route is used as the last step part of the email verification flow. It can also be used for custom flows, such as phone number verification. Once successfully verified, a customer can complete their registration and log into their account.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/customers/verify-account
 *   description: "Storefront guide: Register Customer with Email Verification."
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The verification details
 *         required:
 *           - code
 *         properties:
 *           code:
 *             type: string
 *             title: code
 *             description: The token, OTP, or any other code that was sent to the customer for verification.
 *           code_provider:
 *             type: string
 *             title: code_provider
 *             description: The provider to use for verification. This is optional. When not provided, the default `token` provider is used.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/verification/confirm' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "code": "{value}"
 *       }'
 * tags:
 *   - Verification
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
 * x-since: 2.16.0
 * 
*/

