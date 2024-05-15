/**
 * @schema AdminShippingProfilesResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminShippingProfilesResponse
 * required:
 *   - shipping_profiles
 *   - limit
 *   - offset
 *   - count
 * properties:
 *   shipping_profiles:
 *     type: array
 *     description: The shipping profile's shipping profiles.
 *     items:
 *       $ref: "#/components/schemas/ShippingProfileResponse"
 *   limit:
 *     type: number
 *     title: limit
 *     description: The shipping profile's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The shipping profile's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The shipping profile's count.
 * 
*/

