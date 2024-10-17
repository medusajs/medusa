/**
 * @oas [post] /admin/customers/{id}
 * operationId: PostCustomersId
 * summary: Update a Customer
 * description: Update a customer's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
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
 *             description: The customer's details.
 *             required:
 *               - email
 *               - company_name
 *               - first_name
 *               - last_name
 *               - phone
 *               - metadata
 *             properties:
 *               email:
 *                 type: string
 *                 title: email
 *                 description: The customer's email.
 *                 format: email
 *               company_name:
 *                 type: string
 *                 title: company_name
 *                 description: The customer's company name.
 *               first_name:
 *                 type: string
 *                 title: first_name
 *                 description: The customer's first name.
 *               last_name:
 *                 type: string
 *                 title: last_name
 *                 description: The customer's last name.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The customer's phone.
 *               metadata:
 *                 type: object
 *                 description: The customer's metadata.
 *           - type: object
 *             description: The customer's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The customer's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customers/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "Daren_Rodriguez-Rutherford93@gmail.com",
 *         "company_name": "{value}",
 *         "first_name": "{value}",
 *         "last_name": "{value}",
 *         "phone": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerResponse"
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
 * x-workflow: updateCustomersWorkflow
 * 
*/

