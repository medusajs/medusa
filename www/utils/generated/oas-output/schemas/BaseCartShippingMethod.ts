/**
 * @schema BaseCartShippingMethod
 * type: object
 * description: A cart's shipping method.
 * x-schemaName: BaseCartShippingMethod
 * required:
 *   - id
 *   - cart_id
 *   - name
 *   - amount
 *   - is_tax_inclusive
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping method's ID.
 *   cart_id:
 *     type: string
 *     title: cart_id
 *     description: The ID of the cart this shipping method belongs to.
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping method's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The shipping method's description.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The shipping method's amount.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the shipping method's amount is tax inclusive.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the shipping option this method was created from.
 *   data:
 *     type: object
 *     description: The shipping method's data, useful for fulfillment handling by third-party services.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/cart/concepts#data-property
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/store#manage-metadata
 *       description: Learn how to manage metadata
 *   tax_lines:
 *     type: array
 *     description: The shipping method's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseShippingMethodTaxLine"
 *   adjustments:
 *     type: array
 *     description: The shipping method's adjustments, such as applied promotions.
 *     items:
 *       $ref: "#/components/schemas/BaseShippingMethodAdjustment"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the shipping method was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the shipping method was updated.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The shipping method's original total before discounts, including taxes.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The shipping method's original subtotal before discounts, excluding taxes.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The shipping method's original tax total before discounts.
 *   total:
 *     type: number
 *     title: total
 *     description: The shipping method's total after discounts, including taxes.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The shipping method's subtotal before discounts, excluding taxes.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The shipping method's tax total after discounts.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total amount of discounts applied to the shipping method, including the tax portion of discounts.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total amount of discounts applied to the shipping method's tax. Represents the tax portion of discounts.
 * 
*/

