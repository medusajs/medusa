/**
 * @schema AdminPropertyLabelListResponse
 * type: object
 * description: The paginated list of property labels.
 * x-schemaName: AdminPropertyLabelListResponse
 * required:
 *   - property_labels
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   property_labels:
 *     type: array
 *     description: TThe list of property labels.
 *     items:
 *       $ref: "#/components/schemas/AdminPropertyLabel"
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of property labels.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 * 
*/

