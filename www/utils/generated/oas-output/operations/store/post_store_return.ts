/**
 * @oas [post] /store/return
 * operationId: PostReturn
 * summary: Create Return
 * description: Create a return for an order's items. The admin receives the return and process it from their side.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StoreCreateReturn"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/return' \
 *       -H 'Content-Type: application/json' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 *       --data-raw '{
 *         "order_id": "{value}",
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
 *   - Return
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
 * 
*/

