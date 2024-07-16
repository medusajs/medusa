/**
 * @oas [post] /admin/shipping-options/{id}/rules/batch
 * operationId: PostShippingOptionsIdRulesBatch
 * summary: Add Rules to Shipping Option
 * description: Add a list of rules to a shipping option.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option's ID.
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
 *     description: >-
 *       Comma-separated fields that should be included in the returned data.
 *        * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        * without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: >-
 *         Comma-separated fields that should be included in the returned data.
 *          * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *          * without prefix it will replace the entire default fields.
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
 *             description: The shipping option's create.
 *             items:
 *               type: object
 *               description: The create's details.
 *               required:
 *                 - operator
 *                 - attribute
 *                 - value
 *               properties:
 *                 operator:
 *                   type: string
 *                   enum:
 *                     - in
 *                     - eq
 *                     - ne
 *                     - gt
 *                     - gte
 *                     - lt
 *                     - lte
 *                     - nin
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The create's attribute.
 *                 value:
 *                   oneOf:
 *                     - type: string
 *                       title: value
 *                       description: The create's value.
 *                     - type: array
 *                       description: The create's value.
 *                       items:
 *                         type: string
 *                         title: value
 *                         description: The value's details.
 *           update:
 *             type: array
 *             description: The shipping option's update.
 *             items:
 *               type: object
 *               description: The update's details.
 *               required:
 *                 - id
 *                 - operator
 *                 - attribute
 *                 - value
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The update's ID.
 *                 operator:
 *                   type: string
 *                   enum:
 *                     - in
 *                     - eq
 *                     - ne
 *                     - gt
 *                     - gte
 *                     - lt
 *                     - lte
 *                     - nin
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The update's attribute.
 *                 value:
 *                   oneOf:
 *                     - type: string
 *                       title: value
 *                       description: The update's value.
 *                     - type: array
 *                       description: The update's value.
 *                       items:
 *                         type: string
 *                         title: value
 *                         description: The value's details.
 *           delete:
 *             type: array
 *             description: The shipping option's delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The delete's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}/rules/batch' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Shipping Options
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

