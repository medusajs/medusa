/**
 * @oas [post] /admin/inventory-items/export
 * operationId: PostInventoryItemsExport
 * summary: Export Inventory Items
 * description: |
 *   Start an inventory items export process to retrieve a CSV of exported inventory items.
 * 
 *   You'll receive in the response the transaction ID of the workflow generating the CSV file. To check the status of the execution, send a GET request to `/admin/workflows-executions/export-inventory-items/:transaction-id`.
 *   Once the execution finishes successfully, a notification is created for the export. You can retrieve the notifications using the `/admin/notification` API route to retrieve the file's download URL.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The ID of the inventory item to export.
 *         - type: array
 *           description: The IDs of the inventory items to export.
 *           items:
 *             type: string
 *             title: id
 *             description: The ID of the inventory item to export.
 *   - name: q
 *     in: query
 *     description: Search query to apply on inventory item searchable fields to filter the results.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search query to apply on inventory item searchable fields to filter the results.
 *   - name: sku
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: sku
 *           description: Filter by the inventory item's sku.
 *         - type: array
 *           description: Filter by the inventory items' sku.
 *           items:
 *             type: string
 *             title: sku
 *             description: Filter by the inventory item's sku.
 *   - name: origin_country
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: origin_country
 *           description: Filter by the inventory item's origin country.
 *         - type: array
 *           description: Filter by the inventory items' origin country.
 *           items:
 *             type: string
 *             title: origin_country
 *             description: Filter by the inventory item's origin country.
 *   - name: mid_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: mid_code
 *           description: Filter by the inventory item's mid code.
 *         - type: array
 *           description: Filter by the inventory items' mid code.
 *           items:
 *             type: string
 *             title: mid_code
 *             description: Filter by the inventory item's mid code.
 *   - name: hs_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: hs_code
 *           description: Filter by the inventory item's hs code.
 *         - type: array
 *           description: Filter by the inventory items' hs code.
 *           items:
 *             type: string
 *             title: hs_code
 *             description: Filter by the inventory item's hs code.
 *   - name: material
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: material
 *           description: Filter by the inventory item's material.
 *         - type: array
 *           description: Filter by the inventory items' material.
 *           items:
 *             type: string
 *             title: material
 *             description: Filter by the inventory item's material.
 *   - name: requires_shipping
 *     in: query
 *     description: Filter by whether the inventory item requires shipping.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: requires_shipping
 *       description: Whether the inventory item requires shipping.
 *   - name: weight
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: number
 *           title: weight
 *           description: Filter by the inventory item's weight.
 *         - type: object
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $eq:
 *               oneOf:
 *                 - type: number
 *                   title: $eq
 *                   description: Filter by exact value.
 *                 - type: array
 *                   title: $eq
 *                   description: Filter by exact value.
 *                   items:
 *                     type: number
 *             $ne:
 *               type: number
 *               title: $ne
 *               description: Filter by not equal to the given value.
 *             $in:
 *               type: array
 *               title: $in
 *               description: Filter by values included in the given array.
 *               items:
 *                 type: number
 *             $nin:
 *               type: array
 *               title: $nin
 *               description: Filter by values not included in the given array.
 *               items:
 *                 type: number
 *             $not:
 *               oneOf:
 *                 - type: number
 *                   title: $not
 *                   description: Filter by not equal to the given value.
 *                 - type: object
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: array
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: number
 *             $gt:
 *               type: number
 *               title: $gt
 *               description: Filter by values greater than the given value.
 *             $gte:
 *               type: number
 *               title: $gte
 *               description: Filter by values greater than or equal to the given value.
 *             $lt:
 *               type: number
 *               title: $lt
 *               description: Filter by values less than the given value.
 *             $lte:
 *               type: number
 *               title: $lte
 *               description: Filter by values less than or equal to the given value.
 *             $like:
 *               type: number
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: number
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: number
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: number
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               title: $overlap
 *               description: Filter to apply on array properties to find overlapping values.
 *               items:
 *                 type: number
 *             $contains:
 *               type: array
 *               title: $contains
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $contained:
 *               type: array
 *               title: $contained
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value exists or not.
 *           title: weight
 *           description: Filter by the inventory item's weight.
 *   - name: length
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: number
 *           title: length
 *           description: Filter by the inventory item's length.
 *         - type: object
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $eq:
 *               oneOf:
 *                 - type: number
 *                   title: $eq
 *                   description: Filter by exact value.
 *                 - type: array
 *                   title: $eq
 *                   description: Filter by exact value.
 *                   items:
 *                     type: number
 *             $ne:
 *               type: number
 *               title: $ne
 *               description: Filter by not equal to the given value.
 *             $in:
 *               type: array
 *               title: $in
 *               description: Filter by values included in the given array.
 *               items:
 *                 type: number
 *             $nin:
 *               type: array
 *               title: $nin
 *               description: Filter by values not included in the given array.
 *               items:
 *                 type: number
 *             $not:
 *               oneOf:
 *                 - type: number
 *                   title: $not
 *                   description: Filter by not equal to the given value.
 *                 - type: object
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: array
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: number
 *             $gt:
 *               type: number
 *               title: $gt
 *               description: Filter by values greater than the given value.
 *             $gte:
 *               type: number
 *               title: $gte
 *               description: Filter by values greater than or equal to the given value.
 *             $lt:
 *               type: number
 *               title: $lt
 *               description: Filter by values less than the given value.
 *             $lte:
 *               type: number
 *               title: $lte
 *               description: Filter by values less than or equal to the given value.
 *             $like:
 *               type: number
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: number
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: number
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: number
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               title: $overlap
 *               description: Filter to apply on array properties to find overlapping values.
 *               items:
 *                 type: number
 *             $contains:
 *               type: array
 *               title: $contains
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $contained:
 *               type: array
 *               title: $contained
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value exists or not.
 *           title: length
 *           description: Filter by the inventory item's length.
 *   - name: height
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: number
 *           title: height
 *           description: Filter by the inventory item's height.
 *         - type: object
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $eq:
 *               oneOf:
 *                 - type: number
 *                   title: $eq
 *                   description: Filter by exact value.
 *                 - type: array
 *                   title: $eq
 *                   description: Filter by exact value.
 *                   items:
 *                     type: number
 *             $ne:
 *               type: number
 *               title: $ne
 *               description: Filter by not equal to the given value.
 *             $in:
 *               type: array
 *               title: $in
 *               description: Filter by values included in the given array.
 *               items:
 *                 type: number
 *             $nin:
 *               type: array
 *               title: $nin
 *               description: Filter by values not included in the given array.
 *               items:
 *                 type: number
 *             $not:
 *               oneOf:
 *                 - type: number
 *                   title: $not
 *                   description: Filter by not equal to the given value.
 *                 - type: object
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: array
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: number
 *             $gt:
 *               type: number
 *               title: $gt
 *               description: Filter by values greater than the given value.
 *             $gte:
 *               type: number
 *               title: $gte
 *               description: Filter by values greater than or equal to the given value.
 *             $lt:
 *               type: number
 *               title: $lt
 *               description: Filter by values less than the given value.
 *             $lte:
 *               type: number
 *               title: $lte
 *               description: Filter by values less than or equal to the given value.
 *             $like:
 *               type: number
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: number
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: number
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: number
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               title: $overlap
 *               description: Filter to apply on array properties to find overlapping values.
 *               items:
 *                 type: number
 *             $contains:
 *               type: array
 *               title: $contains
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $contained:
 *               type: array
 *               title: $contained
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value exists or not.
 *           title: height
 *           description: Filter by the inventory item's height.
 *   - name: width
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: number
 *           title: width
 *           description: Filter by the inventory item's width.
 *         - type: object
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *             $eq:
 *               oneOf:
 *                 - type: number
 *                   title: $eq
 *                   description: Filter by exact value.
 *                 - type: array
 *                   title: $eq
 *                   description: Filter by exact value.
 *                   items:
 *                     type: number
 *             $ne:
 *               type: number
 *               title: $ne
 *               description: Filter by not equal to the given value.
 *             $in:
 *               type: array
 *               title: $in
 *               description: Filter by values included in the given array.
 *               items:
 *                 type: number
 *             $nin:
 *               type: array
 *               title: $nin
 *               description: Filter by values not included in the given array.
 *               items:
 *                 type: number
 *             $not:
 *               oneOf:
 *                 - type: number
 *                   title: $not
 *                   description: Filter by not equal to the given value.
 *                 - type: object
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: array
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: number
 *             $gt:
 *               type: number
 *               title: $gt
 *               description: Filter by values greater than the given value.
 *             $gte:
 *               type: number
 *               title: $gte
 *               description: Filter by values greater than or equal to the given value.
 *             $lt:
 *               type: number
 *               title: $lt
 *               description: Filter by values less than the given value.
 *             $lte:
 *               type: number
 *               title: $lte
 *               description: Filter by values less than or equal to the given value.
 *             $like:
 *               type: number
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: number
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: number
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: number
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               title: $overlap
 *               description: Filter to apply on array properties to find overlapping values.
 *               items:
 *                 type: number
 *             $contains:
 *               type: array
 *               title: $contains
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $contained:
 *               type: array
 *               title: $contained
 *               description: Filter to apply on array properties to find contained values.
 *               items:
 *                 type: number
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value exists or not.
 *           title: width
 *           description: Filter by the inventory item's width.
 *   - name: location_levels
 *     in: query
 *     description: Filter by the inventory item's location levels.
 *     required: false
 *     schema:
 *       type: object
 *       description: Filter by the inventory item's location levels.
 *       properties:
 *         location_id:
 *           oneOf:
 *             - type: string
 *               title: location_id
 *               description: Filter by a location ID.
 *             - type: array
 *               description: Filter by multiple location IDs.
 *               items:
 *                 type: string
 *                 title: location_id
 *                 description: A location ID to filter by.
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
 *   - name: with_deleted
 *     in: query
 *     description: Whether to include soft-deleted items in the results.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: Whether to include soft-deleted items in the results.
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
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.inventoryItem.export({})
 *       .then(({ transaction_id }) => {
 *         console.log(transaction_id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/export' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Inventory Items
 * responses:
 *   "202":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminExportInventoryItemResponse"
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
 * x-workflow: exportInventoryItemsWorkflow
 * x-events: []
 * 
*/

