/**
 * @oas [post] /admin/promotions/{id}
 * operationId: PostPromotionsId
 * summary: Update a Promotion
 * description: Update a promotion's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
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
 *         allOf:
 *           - type: object
 *             description: The properties to update in a promotion.
 *             required:
 *               - campaign_id
 *             properties:
 *               code:
 *                 type: string
 *                 title: code
 *                 description: The promotion's code.
 *               is_automatic:
 *                 type: boolean
 *                 title: is_automatic
 *                 description: Whether the promotion is applied automatically.
 *               type:
 *                 type: string
 *                 description: The promotion's type.
 *                 externalDocs:
 *                   url: https://docs.medusajs.com/v2/resources/commerce-modules/promotion/concepts#what-is-a-promotion
 *                 enum:
 *                   - standard
 *                   - buyget
 *               campaign_id:
 *                 type: string
 *                 title: campaign_id
 *                 description: The ID of the campaign that the promotion belongs to.
 *               application_method:
 *                 type: object
 *                 description: The properties to update in the application method.
 *                 required:
 *                   - id
 *                   - description
 *                   - max_quantity
 *                   - currency_code
 *                   - apply_to_quantity
 *                   - buy_rules_min_quantity
 *                 properties:
 *                   id:
 *                     type: string
 *                     title: id
 *                     description: The application method's ID.
 *                   description:
 *                     type: string
 *                     title: description
 *                     description: The application method's description.
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The discounted amount applied by the associated promotion based on the `type`.
 *                   max_quantity:
 *                     type: number
 *                     title: max_quantity
 *                     description: The max quantity allowed in the cart for the associated promotion to be applied.
 *                   currency_code:
 *                     type: string
 *                     title: currency_code
 *                     description: The application method's currency code.
 *                   type:
 *                     type: string
 *                     description: The type of the application method indicating how the associated promotion is applied.
 *                     enum:
 *                       - fixed
 *                       - percentage
 *                   target_type:
 *                     type: string
 *                     description: The target type of the application method indicating whether the associated promotion is applied to the cart's items, shipping methods, or the whole order.
 *                     enum:
 *                       - order
 *                       - shipping_methods
 *                       - items
 *                   allocation:
 *                     type: string
 *                     description: The allocation value that indicates whether the associated promotion is applied on each item in a cart or split between the items in the cart.
 *                     enum:
 *                       - each
 *                       - across
 *                   apply_to_quantity:
 *                     type: number
 *                     title: apply_to_quantity
 *                     description: The quantity that results from matching the `buyget` promotion's condition. For example, if the promotion is a "Buy 2 shirts get 1 free", the value f this attribute is `1`.
 *                   buy_rules_min_quantity:
 *                     type: number
 *                     title: buy_rules_min_quantity
 *                     description: The minimum quantity required for a `buyget` promotion to be applied. For example, if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is `2`.
 *           - type: object
 *             description: The properties to update in a promotion.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The properties to update in a promotion.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "campaign_id": "{value}"
 *       }'
 * tags:
 *   - Promotions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPromotionResponse"
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
 * x-workflow: updatePromotionsWorkflow
 * 
*/

