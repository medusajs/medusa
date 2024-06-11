/**
 * @oas [post] /admin/collections/{id}/products
 * operationId: PostCollectionsIdProducts
 * summary: Add Products to Collection
 * description: Add a list of products to a collection.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The collection's ID.
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
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           add:
 *             type: array
 *             description: The collection's add.
 *             items:
 *               type: string
 *               title: add
 *               description: The add's details.
 *           remove:
 *             type: array
 *             description: The collection's remove.
 *             items:
 *               type: string
 *               title: remove
 *               description: The remove's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/collections/{id}/products' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Collections
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

