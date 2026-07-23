/**
 * @schema BaseLineItemTaxLine
 * type: object
 * description: The tax line's tax lines.
 * x-schemaName: BaseLineItemTaxLine
 * required:
 *   - item
 *   - item_id
 *   - total
 *   - subtotal
 *   - id
 *   - code
 *   - rate
 *   - created_at
 *   - updated_at
 * properties:
 *   item:
 *     $ref: "#/components/schemas/BaseCartLineItem"
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The tax line's item id.
 *   total:
 *     type: number
 *     title: total
 *     description: The tax line's total.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The tax line's subtotal.
 *   id:
 *     type: string
 *     title: id
 *     description: The tax line's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The tax line's description.
 *   tax_rate_id:
 *     type: string
 *     title: tax_rate_id
 *     description: The tax line's tax rate id.
 *   code:
 *     type: string
 *     title: code
 *     description: The tax line's code.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The tax line's rate.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The tax line's provider id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The tax line's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The tax line's updated at.
 * 
*/

