/**
 * @oas [delete] /admin/tax-rates/{id}/rules/{rule_id}
 * operationId: DeleteTaxRatesIdRulesRule_id
 * summary: Remove Rule of Tax Rate
 * x-sidebar-summary: Remove Rule
 * description: Remove a tax rate's rule.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The tax rate's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: rule_id
 *     in: path
 *     description: The tax rate rule's ID.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/tax-rates/{id}/rules/{rule_id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Tax Rates
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The deletion's details.
 *               required:
 *                 - id
 *                 - object
 *                 - deleted
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The tax rate's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the Tax Rate was deleted.
 *             - type: object
 *               description: The deletion's details.
 *               properties:
 *                 parent:
 *                   $ref: "#/components/schemas/AdminTaxRate"
 *           description: The deletion's details.
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
 * x-workflow: deleteTaxRateRulesWorkflow
 * 
*/

