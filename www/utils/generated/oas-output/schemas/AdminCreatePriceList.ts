/**
 * @schema AdminCreatePriceList
 * type: object
 * description: The price list's details.
 * x-schemaName: AdminCreatePriceList
 * required:
 *   - title
 *   - description
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The price list's title.
 *   description:
 *     type: string
 *     title: description
 *     description: The price list's description.
 *   starts_at:
 *     type: string
 *     title: starts_at
 *     description: The date and time the price list starts at.
 *     format: date-time
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The date and time the price list ends at.
 *     format: date-time
 *   status:
 *     type: string
 *     description: The price list's status.
 *     enum:
 *       - active
 *       - draft
 *   type:
 *     type: string
 *     description: The price list's type.
 *     enum:
 *       - sale
 *       - override
 *   rules:
 *     type: object
 *     description: The price list's rules.
 *     example:
 *       product_category_id: pcat_123
 *   prices:
 *     type: array
 *     description: The price list's prices.
 *     items:
 *       $ref: "#/components/schemas/AdminCreatePriceListPrice"
 *   metadata:
 *     type: object
 *     description: Key-value pairs of custom data.
 * 
*/

