/**
 * @oas [post] /auth/verification/confirm
 * operationId: PostVerificationConfirm
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
 *           - code
 *         properties:
 *           code:
 *             type: string
 *             title: code
 *             description: The verification's code.
 *           code_provider:
 *             type: string
 *             title: code_provider
 *             description: The verification's code provider.
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
 * 
*/

