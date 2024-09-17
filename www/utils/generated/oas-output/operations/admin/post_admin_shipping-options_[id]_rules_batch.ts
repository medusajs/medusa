/**
 * @oas [post] /admin/shipping-options/{id}/rules/batch
 * operationId: PostShippingOptionsIdRulesBatch
 * summary: Manage the Rules of a Shipping Option
 * x-sidebar-summary: Manage Rules
 * description: Manage the rules of a shipping option to create, update, or delete them.
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
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The rules to create, update, or delete.
 *         properties:
 *           create:
 *             type: array
 *             description: The shipping option rules to create.
 *             items:
 *               type: object
 *               description: A shipping option's details.
 *               required:
 *                 - operator
 *                 - attribute
 *                 - value
 *               properties:
 *                 operator:
 *                   type: string
 *                   description: The operator used to check whether a rule applies.
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
 *                   description: The name of a property or table that the rule applies to.
 *                   example: customer_group
 *                 value:
 *                   oneOf:
 *                     - type: string
 *                       title: value
 *                       description: A value of the attribute that enables this rule.
 *                       example: cusgroup_123
 *                     - type: array
 *                       description: Values of the attribute that enable this rule.
 *                       items:
 *                         type: string
 *                         title: value
 *                         description: A value of the attribute that enables this rule.
 *                         example: cusgroup_123
 *           update:
 *             type: array
 *             description: The shipping option rules to update.
 *             items:
 *               type: object
 *               description: The properties to update in the shipping option rule.
 *               required:
 *                 - id
 *                 - operator
 *                 - attribute
 *                 - value
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The rule's ID.
 *                 operator:
 *                   type: string
 *                   description: The operator used to check whether a rule applies.
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
 *                   description: The name of a property or table that the rule applies to.
 *                   example: customer_group
 *                 value:
 *                   oneOf:
 *                     - type: string
 *                       title: value
 *                       description: A value of the attribute that enables this rule.
 *                       example: cusgroup_123
 *                     - type: array
 *                       description: Values of the attribute that enable this rule.
 *                       items:
 *                         type: string
 *                         title: value
 *                         description: A value of the attribute that enables this rule.
 *                         example: cusgroup_123
 *           delete:
 *             type: array
 *             description: The shipping option rules to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: A rule's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}/rules/batch' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The batch operation's result.
 *           required:
 *             - created
 *             - updated
 *             - deleted
 *           properties:
 *             created:
 *               type: array
 *               description: The created shipping option rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminShippingOptionRule"
 *             updated:
 *               type: array
 *               description: The updated shipping option rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminShippingOptionRule"
 *             deleted:
 *               type: object
 *               description: The details of the deleted shipping option rules.
 *               required:
 *                 - ids
 *                 - object
 *                 - deleted
 *               properties:
 *                 ids:
 *                   type: array
 *                   description: The IDs of the deleted shipping option rules.
 *                   items:
 *                     type: string
 *                     title: ids
 *                     description: A shipping option rule's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                   default: shipping_option_rule
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: The deleted's details.
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
 * x-workflow: batchShippingOptionRulesWorkflow
 * 
*/

