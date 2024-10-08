/**
 * @oas [delete] /admin/api-keys/{id}
 * operationId: DeleteApiKeysId
 * summary: Delete an Api Key
 * description: |
 *   Delete a publishable or secret API key.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The API key's ID.
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
 *       curl -X DELETE '{backend_url}/admin/api-keys/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Api Keys
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
 *               description: The API key's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the object that was deleted.
 *               default: api_key
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the API key was deleted.
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
 * x-workflow: deleteApiKeysWorkflow
 * 
*/

