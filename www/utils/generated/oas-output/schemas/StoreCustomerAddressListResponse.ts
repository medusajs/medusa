/**
 * @schema StoreCustomerAddressListResponse
 * type: object
 * description: The paginated list of customer addresses.
 * x-schemaName: StoreCustomerAddressListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - addresses
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items.
 *   addresses:
 *     type: array
 *     description: The list of addresses.
 *     items:
 *       $ref: "#/components/schemas/StoreCustomerAddress"
 * 
*/

