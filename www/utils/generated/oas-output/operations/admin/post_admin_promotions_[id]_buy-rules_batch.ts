/**
 * @oas [post] /admin/promotions/{id}/buy-rules/batch
 * operationId: PostPromotionsIdBuyRulesBatch
 * summary: Add Buy Rules to Promotion
 * description: Add a list of buy rules to a promotion.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
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
 *           create:
 *             type: array
 *             description: The promotion's create.
 *             items:
 *               type: object
 *               description: The create's details.
 *               required:
 *                 - operator
 *                 - description
 *                 - attribute
 *                 - values
 *               properties:
 *                 operator:
 *                   type: string
 *                   enum:
 *                     - gte
 *                     - lte
 *                     - gt
 *                     - lt
 *                     - eq
 *                     - ne
 *                     - in
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The create's description.
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The create's attribute.
 *                 values:
 *                   oneOf:
 *                     - type: string
 *                       title: values
 *                       description: The create's values.
 *                     - type: array
 *                       description: The create's values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: The value's values.
 *           update:
 *             type: array
 *             description: The promotion's update.
 *             items:
 *               type: object
 *               description: The update's details.
 *               required:
 *                 - id
 *                 - description
 *                 - values
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The update's ID.
 *                 operator:
 *                   type: string
 *                   enum:
 *                     - gte
 *                     - lte
 *                     - gt
 *                     - lt
 *                     - eq
 *                     - ne
 *                     - in
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The update's description.
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The update's attribute.
 *                 values:
 *                   oneOf:
 *                     - type: string
 *                       title: values
 *                       description: The update's values.
 *                     - type: array
 *                       description: The update's values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: The value's values.
 *           delete:
 *             type: array
 *             description: The promotion's delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The delete's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions/{id}/buy-rules/batch' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Promotions
 * responses:
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

