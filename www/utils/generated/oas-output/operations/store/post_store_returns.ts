/**
 * @oas [post] /store/returns
 * operationId: PostReturns
 * summary: Create Return
 * description: Create a return for an order's items. The admin receives the return and process it from their side.
 * x-authenticated: false
 * parameters:
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store#publishable-api-key
 *   - name: x-medusa-locale
 *     in: header
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 *   - name: locale
 *     in: query
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StoreCreateReturn"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/returns' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "order_id": "order_123",
 *         "items": [
 *           {
 *             "id": "id_XbfptxUVo2io9EI",
 *             "quantity": 7916429753974784,
 *             "reason_id": "{value}",
 *             "note": "{value}"
 *           }
 *         ],
 *         "return_shipping": {
 *           "option_id": "{value}",
 *           "price": 1068364080349184
 *         },
 *         "note": "{value}",
 *         "location_id": "{value}"
 *       }'
 * tags:
 *   - Returns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreReturnResponse"
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
 * x-workflow: createAndCompleteReturnOrderWorkflow
 * x-events:
 *   - name: order.return_requested
 *     payload: |-
 *       ```ts
 *       {
 *         order_id, // The ID of the order
 *         return_id, // The ID of the return
 *       }
 *       ```
 *     description: Emitted when a return request is confirmed.
 *     deprecated: false
 *   - name: order.return_received
 *     payload: |-
 *       ```ts
 *       {
 *         order_id, // The ID of the order
 *         return_id, // The ID of the return
 *       }
 *       ```
 *     description: Emitted when a return is marked as received.
 *     deprecated: false
 * x-since: 2.8.0
 * 
*/

