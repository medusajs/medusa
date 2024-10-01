/**
 * @schema StoreAddCartLineItem
 * type: object
 * description: The details of the line item to add.
 * x-schemaName: StoreAddCartLineItem
 * required:
 *   - variant_id
 *   - quantity
 * properties:
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The ID of the product variant to add to the cart.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 * 
*/

