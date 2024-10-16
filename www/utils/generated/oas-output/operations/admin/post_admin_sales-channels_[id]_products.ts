/**
 * @oas [post] /admin/sales-channels/{id}/products
 * operationId: PostSalesChannelsIdProducts
 * summary: Manage Products in Sales Channel
 * x-sidebar-summary: Manage Products
 * description: Manage products in a sales channel to add or remove them from the channel.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The sales channel's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The products to add or remove from the channel.
 *         properties:
 *           add:
 *             type: array
 *             description: The products to add to the sales channel.
 *             items:
 *               type: string
 *               title: add
 *               description: A product's ID.
 *           remove:
 *             type: array
 *             description: The products to remove from the sales channel.
 *             items:
 *               type: string
 *               title: remove
 *               description: A product's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/sales-channels/{id}/products' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Sales Channels
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSalesChannelResponse"
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
 * x-workflow: linkProductsToSalesChannelWorkflow
 * 
*/

