/**
 * @oas [delete] /admin/return-reasons/{id}
 * operationId: DeleteReturnReasonsId
 * summary: Delete a Return Reason
 * description: Delete a return reason.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The return reason's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/return-reasons/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Return Reasons
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The return reason's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               default: return_reason
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the return reason was deleted.
 *             parent:
 *               type: object
 *               description: The return reason's parent.
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
 * x-workflow: deleteReturnReasonsWorkflow
 * 
*/

