/**
 * @schema AdminFulfillmentProviderListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminFulfillmentProviderListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - fulfillment_providers
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The fulfillment provider's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The fulfillment provider's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The fulfillment provider's count.
 *   fulfillment_providers:
 *     type: array
 *     description: The fulfillment provider's fulfillment providers.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentProvider"
 * 
*/

