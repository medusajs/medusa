/**
 * @schema AdminUpdatePriceList
 * type: object
 * description: the details to update in a price list.
 * x-schemaName: AdminUpdatePriceList
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
 *     description: The date the price list starts.
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The date the price list ends.
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
 *       customer_group_id:
 *         - cusgrp_123
 * 
*/

