/**
 * @schema StoreCartShippingMethod
 * type: object
 * description: A cart's shipping method.
 * x-schemaName: StoreCartShippingMethod
 * required:
 *   - id
 *   - cart_id
 *   - name
 *   - amount
 *   - is_tax_inclusive
 *   - created_at
 *   - updated_at
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
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
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/cart/concepts#data-property
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata, can hold custom key-value pairs.
 *   tax_lines:
 *     type: array
 *     description: The shipping method's tax lines.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The tax line's details
 *           x-schemaName: BaseShippingMethodTaxLine
 *           required:
 *             - shipping_method
 *             - shipping_method_id
 *             - total
 *             - subtotal
 *             - id
 *             - code
 *             - rate
 *             - created_at
 *             - updated_at
 *           properties:
 *             shipping_method:
 *               type: object
 *               title: shipping_method
 *               description: The details of the method that the tax line belongs to.
 *             shipping_method_id:
 *               type: string
 *               title: shipping_method_id
 *               description: The ID of the shipping method this tax line belongs to.
 *             total:
 *               type: number
 *               title: total
 *               description: The method's total including taxes and promotions.
 *             subtotal:
 *               type: number
 *               title: subtotal
 *               description: The method's total excluding taxes, including promotions.
 *             id:
 *               type: string
 *               title: id
 *               description: The tax line's ID.
 *             description:
 *               type: string
 *               title: description
 *               description: The tax line's description.
 *             tax_rate_id:
 *               type: string
 *               title: tax_rate_id
 *               description: The ID of the applied tax rate.
 *             code:
 *               type: string
 *               title: code
 *               description: The code that the tax rate is identified by.
 *             rate:
 *               type: number
 *               title: rate
 *               description: The charged rate.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The ID of the tax provider used to calculate the tax line.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the tax line was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the tax line was updated.
 *         - type: object
 *           description: The tax line's details.
 *           required:
 *             - shipping_method
 *           properties:
 *             shipping_method:
 *               type: object
 *               title: shipping_method
 *               description: The details of the method that the tax line belongs to.
 *       description: The tax line's details.
 *   adjustments:
 *     type: array
 *     description: The shipping method's adjustments, such as applied promotions.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The adjustment's details.
 *           x-schemaName: BaseShippingMethodAdjustment
 *           required:
 *             - shipping_method
 *             - shipping_method_id
 *             - id
 *             - amount
 *             - cart_id
 *             - created_at
 *             - updated_at
 *           properties:
 *             shipping_method:
 *               type: object
 *               title: shipping_method
 *               description: The details of the method that the adjustment belongs to.
 *             id:
 *               type: string
 *               title: id
 *               description: The adjustment's ID.
 *             code:
 *               type: string
 *               title: code
 *               description: The adjustment's code.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The adjustment's amount.
 *             cart_id:
 *               type: string
 *               title: cart_id
 *               description: The ID of the associated cart.
 *             description:
 *               type: string
 *               title: description
 *               description: The adjustment's description.
 *             promotion_id:
 *               type: string
 *               title: promotion_id
 *               description: The ID of the applied promotion.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The adjustment's provider ID.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the adjustment was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the adjustment was updated.
 *         - type: object
 *           description: The adjustment's details.
 *           required:
 *             - shipping_method
 *           properties:
 *             shipping_method:
 *               type: object
 *               title: shipping_method
 *               description: The details of the method that the adjustment belongs to.
 *       description: The adjustment's details.
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
 *     description: The shipping method's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The shipping method's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The total taxes applied on the shipping method's amount including promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The shipping method's total amount including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The shipping method's total amount excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The total taxes applied on the shipping method's amount including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total amount discounted.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The taxes applied on the discounted amount.
 * 
*/

