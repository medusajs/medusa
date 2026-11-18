/**
 * @schema AdminUserListResponse
 * type: object
 * description: The paginated list of users.
 * x-schemaName: AdminUserListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - users
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
 *   users:
 *     type: array
 *     description: The list of users.
 *     items:
 *       $ref: "#/components/schemas/AdminUser"
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *     deprecated: true
 * 
*/

