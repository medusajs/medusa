/**
 * @oas [post] /admin/promotions/{id}/rules/batch
 * operationId: PostPromotionsIdRulesBatch
 * summary: Manage a Promotion's Rules
 * x-sidebar-summary: Manage Rules
 * description: Manage the rules of a promotion to create, update, or delete them.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: promotion_type
 *     in: query
 *     description: The promotion's type.
 *     required: false
 *     schema:
 *       type: string
 *       description: The promotion's type.
 *       enum:
 *         - standard
 *         - buyget
 *   - name: application_method_type
 *     in: query
 *     description: The promotion's application method type.
 *     required: false
 *     schema:
 *       type: string
 *       description: The promotion's application method type.
 *       enum:
 *         - fixed
 *         - percentage
 *   - name: application_method_target_type
 *     in: query
 *     description: The promotion's application method target type.
 *     required: false
 *     schema:
 *       type: string
 *       description: The promotion's application method target type.
 *       enum:
 *         - items
 *         - shipping_methods
 *         - order
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
 *             description: The rules to create.
 *             items:
 *               $ref: "#/components/schemas/AdminCreatePromotionRule"
 *           update:
 *             type: array
 *             description: The rules to update.
 *             items:
 *               $ref: "#/components/schemas/AdminUpdatePromotionRule"
 *           delete:
 *             type: array
 *             description: The rules to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: A rule's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions/{id}/rules/batch' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Promotions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The result of the batch operations.
 *           required:
 *             - created
 *             - updated
 *             - deleted
 *           properties:
 *             created:
 *               type: array
 *               description: The created rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminPromotionRule"
 *             updated:
 *               type: array
 *               description: The updated rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminPromotionRule"
 *             deleted:
 *               type: object
 *               description: The details of the deleted buy rules.
 *               required:
 *                 - ids
 *                 - object
 *                 - deleted
 *               properties:
 *                 ids:
 *                   type: array
 *                   description: The IDs of the deleted rules.
 *                   items:
 *                     type: string
 *                     title: ids
 *                     description: A rule's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the object that was deleted.
 *                   default: promotion-rule
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the rules were deleted.
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
 * x-workflow: batchPromotionRulesWorkflow
 * x-events:
 *   - name: promotion.rules_updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the promotion
 *         rule_type, // The type of rules changed: "rules", "target_rules", or "buy_rules"
 *         created, // The IDs of the created rules
 *         updated, // The IDs of the updated rules
 *         deleted, // The IDs of the deleted rules
 *       }
 *       ```
 *     description: |-
 *       Emitted when a promotion's rules, target rules, or buy rules
 *       are created, updated, or deleted in a batch.
 *     deprecated: false
 *     since: 2.22.7
 * 
*/

