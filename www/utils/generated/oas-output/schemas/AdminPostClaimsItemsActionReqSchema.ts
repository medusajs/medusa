/**
 * @schema AdminPostClaimsItemsActionReqSchema
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostClaimsItemsActionReqSchema
 * properties:
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The claim's quantity.
 *   reason:
 *     type: string
 *     enum:
 *       - missing_item
 *       - wrong_item
 *       - production_failure
 *       - other
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: The claim's internal note.
 * 
*/

