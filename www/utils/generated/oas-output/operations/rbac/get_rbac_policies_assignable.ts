/**
 * @oas [get] /rbac/policies/assignable
 * operationId: GetPoliciesAssignable
 * summary: List Assignable Policies
 * description: Retrieve the policies that the logged-in actor can add to roles. Pass the `scope` and `scope_id` query parameters to retrieve the policies the actor can add within that scope.
 * x-authenticated: false
 * parameters:
 *   - name: scope
 *     in: query
 *     description: The policy's scope.
 *     required: false
 *     schema:
 *       type: string
 *       title: scope
 *       description: The policy's scope.
 *   - name: scope_id
 *     in: query
 *     description: The policy's scope id.
 *     required: false
 *     schema:
 *       type: string
 *       title: scope_id
 *       description: The policy's scope id.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The policy's ID.
 *         - type: array
 *           description: The policy's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: created_at
 *     in: query
 *     description: The policy's created at.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: created_at
 *       description: The policy's created at.
 *   - name: updated_at
 *     in: query
 *     description: The policy's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: updated_at
 *       description: The policy's updated at.
 *   - name: deleted_at
 *     in: query
 *     description: The policy's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: deleted_at
 *       description: The policy's deleted at.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: q
 *     in: query
 *     description: The policy's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The policy's q.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: with_deleted
 *     in: query
 *     description: The policy's with deleted.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: The policy's with deleted.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 *   - name: key
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: key
 *           description: The policy's key.
 *         - type: array
 *           description: The policy's key.
 *           items:
 *             type: string
 *             title: key
 *             description: The key's details.
 *   - name: resource
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: resource
 *           description: The policy's resource.
 *         - type: array
 *           description: The policy's resource.
 *           items:
 *             type: string
 *             title: resource
 *             description: The resource's details.
 *   - name: operation
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: operation
 *           description: The policy's operation.
 *         - type: array
 *           description: The policy's operation.
 *           items:
 *             type: string
 *             title: operation
 *             description: The operation's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/rbac/policies/assignable'
 * tags:
 *   - Policies
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacAssignablePoliciesListResponse"
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
 * x-workflow: getAssignablePoliciesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

