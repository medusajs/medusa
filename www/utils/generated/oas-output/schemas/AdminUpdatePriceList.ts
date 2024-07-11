/**
 * @schema AdminUpdatePriceList
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminUpdatePriceList
 * required:
 *   - description
 *   - starts_at
 *   - ends_at
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
 *     description: The price list's starts at.
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The price list's ends at.
 *   status:
 *     type: string
 *     enum:
 *       - active
 *       - draft
 *   type:
 *     type: string
 *     enum:
 *       - sale
 *       - override
 *   rules:
 *     type: object
 *     description: The price list's rules.
 * 
*/

