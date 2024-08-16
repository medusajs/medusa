/**
 * @schema AdminClaimListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminClaimListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - claims
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The claim's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The claim's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The claim's count.
 *   claims:
 *     type: array
 *     description: The claim's claims.
 *     items:
 *       $ref: "#/components/schemas/AdminClaim"
 * 
*/

