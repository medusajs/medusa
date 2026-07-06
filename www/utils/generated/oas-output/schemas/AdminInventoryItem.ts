/**
 * @schema AdminInventoryItem
 * type: object
 * description: The inventory item's details.
 * x-schemaName: AdminInventoryItem
 * required:
 *   - id
 *   - requires_shipping
 *   - stocked_quantity
 *   - reserved_quantity
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The inventory item's ID.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The inventory item's sku.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The inventory item's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The inventory item's HS code.
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the inventory item requires shipping.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The inventory item's MID code.
 *   material:
 *     type: string
 *     title: material
 *     description: The inventory item's material.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The inventory item's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The inventory item's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The inventory item's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The inventory item's width.
 *   title:
 *     type: string
 *     title: title
 *     description: The inventory item's title.
 *   description:
 *     type: string
 *     title: description
 *     description: The inventory item's description.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The thumbnail URL of the inventory item.
 *   metadata:
 *     type: object
 *     description: Custom key-value pairs, used to store additional information about the inventory item.
 *   location_levels:
 *     type: array
 *     description: The inventory item's location levels.
 *     items:
 *       $ref: "#/components/schemas/AdminInventoryLevel"
 *   stocked_quantity:
 *     type: number
 *     title: stocked_quantity
 *     description: The inventory item's stocked quantity.
 *   reserved_quantity:
 *     type: number
 *     title: reserved_quantity
 *     description: The inventory item's reserved quantity.
 * 
*/

