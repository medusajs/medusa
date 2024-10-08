/**
 * @schema BaseLineItemTaxLine
 * type: object
 * description: The tax line's details
 * x-schemaName: BaseLineItemTaxLine
 * properties:
 *   item:
 *     $ref: "#/components/schemas/BaseCartLineItem"
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The ID of the item the tax line applies on.
 *   total:
 *     type: number
 *     title: total
 *     description: The item's total, including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The item's subtotal excluding taxes, including promotions.
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
 *     description: The ID of the associated tax rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The code the tax rate is identified by.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The rate to charge.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the tax provider.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the tax line was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the tax line was updated.
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
 * 
*/

