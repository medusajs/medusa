/**
 * @schema AdminUpdateShippingOptionPriceWithRegion
 * type: object
 * description: The properties to update in a shipping option price with a region.
 * x-schemaName: AdminUpdateShippingOptionPriceWithRegion
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The price's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the region the price is associated with.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The price's amount.
 *   rules:
 *     type: array
 *     description: The price's rules.
 *     items:
 *       $ref: "#/components/schemas/PriceRule"
 * 
*/

