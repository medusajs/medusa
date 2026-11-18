/**
 * @schema AdminUserRoleListResponse
 * type: object
 * description: The paginated list of roles assigned to the user.
 * x-schemaName: AdminUserRoleListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - roles
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items retrieved.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items to skip before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items.
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *     deprecated: true
 *   roles:
 *     type: array
 *     description: The list of roles.
 *     items:
 *       $ref: "#/components/schemas/AdminRbacRole"
 * 
*/

